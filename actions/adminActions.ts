'use server';

import prisma from '@/lib/prisma';
import { comparePassword, hashPassword, setSessionCookie, clearSessionCookie, getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Reusable permission validation guard
async function enforcePermission(permission: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthenticated');
  
  // Fetch user role and its permission mapping from database
  const user = await prisma.user.findUnique({
    where: { id: session.id }
  });
  if (!user) throw new Error('User not found');

  const role = await prisma.role.findUnique({
    where: { id: user.roleId }
  });
  if (!role) throw new Error('Role not found');

  // Super admin overrides everything
  if (role.name === 'super_admin') return session;

  // For JSON fallback database, it has static or cached values. For real Prisma it handles relations.
  // In our lib/prisma fallback, roles have permissions mapped.
  // Let's check permission name
  const permissions = await prisma.permission.findMany();
  // Standard RBAC check: does user have role that possesses this permission?
  // Our JSON DB loader resolves fields. Let's do a safe check:
  if (role.permissionIds && Array.isArray(role.permissionIds)) {
    const permRecord = permissions.find((p: any) => p.name === permission);
    if (permRecord && role.permissionIds.includes(permRecord.id)) {
      return session;
    }
  }

  // Fallback check against hardcoded defaults
  const ROLE_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['create', 'update', 'delete', 'publish', 'manage_users', 'manage_roles', 'manage_settings', 'manage_content'],
    admin: ['create', 'update', 'publish', 'manage_content', 'manage_settings'],
    editor: ['create', 'update', 'publish', 'manage_content'],
    moderator: ['update', 'manage_content'],
    user: []
  };

  const allowed = ROLE_PERMISSIONS[role.name.toLowerCase()]?.includes(permission);
  if (!allowed) {
    throw new Error(`Unauthorized: Missing permission '${permission}'`);
  }

  return session;
}

// ----------------------------------------------------
// AUTH ACTIONS
// ----------------------------------------------------

export async function loginAction(data: { username: string; password: string; rememberMe: boolean }) {
  try {
    const { username, password, rememberMe } = data;
    
    // Temporary hardcode override for admin 'balu'
    if (username === 'balu' && password === 'root123#') {
      let adminUser: any = null;
      let roleName = 'super_admin';
      
      try {
        let adminRole = await prisma.role.findUnique({ where: { name: 'super_admin' } });
        if (!adminRole) {
          adminRole = await prisma.role.create({
            data: { name: 'super_admin', description: 'Super Administrator' }
          });
        }

        adminUser = await prisma.user.findUnique({ where: { username: 'balu' } });
        if (!adminUser) {
          const hashed = await hashPassword('root123#');
          adminUser = await prisma.user.create({
            data: {
              username: 'balu',
              email: 'admin@bexa.studio',
              passwordHash: hashed,
              phone: '+998 90 123 45 67',
              roleId: adminRole.id
            }
          });
        } else if (adminUser.roleId !== adminRole.id) {
          adminUser = await prisma.user.update({
            where: { id: adminUser.id },
            data: { roleId: adminRole.id }
          });
        }

        await prisma.activityLog.create({
          data: {
            userId: adminUser.id,
            action: 'USER_LOGIN',
            details: `User balu logged in successfully using hardcoded credentials (Role: ${roleName})`,
            ipAddress: '127.0.0.1'
          }
        });
      } catch (dbError) {
        // Safe database bypass if DB is offline, empty, or currently unseeded.
        // We still proceed with authentication, which is the primary duty of this fallback override!
      }
      
      const finalUserId = adminUser?.id || 'admin-fallback-id';
      const finalEmail = adminUser?.email || 'admin@bexa.studio';

      await setSessionCookie({
        id: finalUserId,
        username: 'balu',
        email: finalEmail,
        role: roleName
      }, rememberMe);

      return { success: true, user: { username: 'balu', role: roleName } };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Compare password hash
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Load role name
    const roleRecord = await prisma.role.findUnique({
      where: { id: user.roleId }
    });
    const roleName = roleRecord?.name || 'user';

    // Set secure cookie
    await setSessionCookie({
      id: user.id,
      username: user.username,
      email: user.email,
      role: roleName
    }, rememberMe);

    // Create activity audit
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        details: `User logged in successfully (Role: ${roleName})`,
        ipAddress: '127.0.0.1'
      }
    });

    return { success: true, user: { username: user.username, role: roleName } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Server login failed' };
  }
}

export async function logoutAction() {
  try {
    const session = await getSession();
    if (session) {
      try {
        await prisma.activityLog.create({
          data: {
            userId: session.id,
            action: 'USER_LOGOUT',
            details: 'User logged out',
            ipAddress: '127.0.0.1'
          }
        });
      } catch (e) {
        // Safe database bypass on logout log if database has latency or is offline
      }
    }

    await clearSessionCookie();
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function registerAction(data: { username: string; email: string; password: string; phone: string }) {
  try {
    const { username, email, password, phone } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return { success: false, error: 'Username already taken' };

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return { success: false, error: 'Email already registered' };

    // Get default 'user' role
    let userRole = await prisma.role.findUnique({ where: { name: 'user' } });
    if (!userRole) {
      userRole = await prisma.role.create({
        data: { name: 'user', description: 'Standard user' }
      });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashed,
        phone,
        roleId: userRole.id
      }
    });

    // Create log
    await prisma.activityLog.create({
      data: {
        userId: newUser.id,
        action: 'USER_REGISTER',
        details: 'New user registered',
        ipAddress: '127.0.0.1'
      }
    });

    return { success: true, username: newUser.username };
  } catch (e: any) {
    return { success: false, error: e.message || 'Registration failed' };
  }
}

// ----------------------------------------------------
// USER MODULE CRUD
// ----------------------------------------------------

export async function getUsers() {
  try {
    await enforcePermission('manage_users');
    const usersList = await prisma.user.findMany();
    const rolesList = await prisma.role.findMany();

    // Map role names onto users
    return usersList.map((u: any) => {
      const r = rolesList.find((role: any) => role.id === u.roleId);
      return {
        ...u,
        role: r?.name || 'user'
      };
    });
  } catch (e) {
    return [];
  }
}

export async function updateUserRole(userId: string, newRoleName: string) {
  try {
    const session = await enforcePermission('manage_users');
    
    const roleRecord = await prisma.role.findUnique({ where: { name: newRoleName } });
    if (!roleRecord) return { success: false, error: 'Role not found' };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { roleId: roleRecord.id }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_USER_ROLE',
        details: `Assigned user '${updated.username}' to role '${newRoleName}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/admin/users', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await enforcePermission('manage_users');
    
    // Prevent self deletion
    if (session.id === userId) {
      return { success: false, error: 'Cannot delete your own account!' };
    }

    const deleted = await prisma.user.delete({
      where: { id: userId }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_USER',
        details: `Deleted user account '${deleted.username}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/admin/users', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// ROLE MODULE CRUD
// ----------------------------------------------------

export async function getRoles() {
  try {
    await enforcePermission('manage_roles');
    return await prisma.role.findMany();
  } catch (e) {
    return [];
  }
}

export async function getPermissions() {
  try {
    await enforcePermission('manage_roles');
    return await prisma.permission.findMany();
  } catch (e) {
    return [];
  }
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]) {
  try {
    const session = await enforcePermission('manage_roles');

    const updated = await prisma.role.update({
      where: { id: roleId },
      data: {
        permissionIds: permissionIds // JSON DB handles direct arrays. PostgreSQL handles relations.
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_ROLE_PERMISSIONS',
        details: `Updated permissions mapping for role '${updated.name}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/admin/roles', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// PORTFOLIO CRUD
// ----------------------------------------------------

export async function getPortfolio() {
  return await prisma.portfolio.findMany({ orderBy: { order: 'asc' } });
}

export async function createPortfolioItem(data: any) {
  try {
    const session = await enforcePermission('create');
    const item = await prisma.portfolio.create({ data });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'CREATE_PORTFOLIO',
        details: `Created portfolio project: '${item.titleEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/portfolio', 'page');
    revalidatePath('/[locale]/admin/portfolio', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updatePortfolioItem(id: string, data: any) {
  try {
    const session = await enforcePermission('update');
    const item = await prisma.portfolio.update({
      where: { id },
      data
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_PORTFOLIO',
        details: `Updated portfolio project: '${item.titleEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/portfolio', 'page');
    revalidatePath('/[locale]/admin/portfolio', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    const session = await enforcePermission('delete');
    const item = await prisma.portfolio.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_PORTFOLIO',
        details: `Deleted portfolio project: '${item.titleEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/portfolio', 'page');
    revalidatePath('/[locale]/admin/portfolio', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// NEWS CRUD
// ----------------------------------------------------

export async function getNews() {
  return await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createNewsItem(data: any) {
  try {
    const session = await enforcePermission('create');
    const slug = data.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item = await prisma.news.create({
      data: { ...data, slug }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'CREATE_NEWS',
        details: `Published news article: '${item.titleEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/news', 'page');
    revalidatePath('/[locale]/admin/news', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateNewsItem(id: string, data: any) {
  try {
    const session = await enforcePermission('update');
    const slug = data.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item = await prisma.news.update({
      where: { id },
      data: { ...data, slug }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_NEWS',
        details: `Updated news article: '${item.titleEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/news', 'page');
    revalidatePath('/[locale]/admin/news', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteNewsItem(id: string) {
  try {
    const session = await enforcePermission('delete');
    const item = await prisma.news.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_NEWS',
        details: `Deleted news article: '${item.titleEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/news', 'page');
    revalidatePath('/[locale]/admin/news', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// TEAM CRUD
// ----------------------------------------------------

export async function getTeamMembers() {
  return await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
}

export async function createTeamMember(data: any) {
  try {
    const session = await enforcePermission('create');
    const item = await prisma.teamMember.create({ data });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'CREATE_TEAM',
        details: `Added team profile: '${item.name}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/team', 'page');
    revalidatePath('/[locale]/admin/team', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateTeamMember(id: string, data: any) {
  try {
    const session = await enforcePermission('update');
    const item = await prisma.teamMember.update({
      where: { id },
      data
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_TEAM',
        details: `Updated team profile: '${item.name}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/team', 'page');
    revalidatePath('/[locale]/admin/team', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const session = await enforcePermission('delete');
    const item = await prisma.teamMember.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_TEAM',
        details: `Removed team profile: '${item.name}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/team', 'page');
    revalidatePath('/[locale]/admin/team', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// FAQ CRUD
// ----------------------------------------------------

export async function getFAQs() {
  return await prisma.faq.findMany({ orderBy: { order: 'asc' } });
}

export async function createFAQ(data: any) {
  try {
    const session = await enforcePermission('create');
    const item = await prisma.faq.create({ data });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'CREATE_FAQ',
        details: `Added FAQ question: '${item.questionEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/faq', 'page');
    revalidatePath('/[locale]/admin/faq', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateFAQ(id: string, data: any) {
  try {
    const session = await enforcePermission('update');
    const item = await prisma.faq.update({
      where: { id },
      data
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_FAQ',
        details: `Updated FAQ question: '${item.questionEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/faq', 'page');
    revalidatePath('/[locale]/admin/faq', 'page');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteFAQ(id: string) {
  try {
    const session = await enforcePermission('delete');
    const item = await prisma.faq.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_FAQ',
        details: `Deleted FAQ question: '${item.questionEn}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]/faq', 'page');
    revalidatePath('/[locale]/admin/faq', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// SETTINGS CRUD
// ----------------------------------------------------

export async function getSettings() {
  return await prisma.settings.findMany();
}

export async function updateSettings(settingsMap: Record<string, string>) {
  try {
    const session = await enforcePermission('manage_settings');

    for (const [key, value] of Object.entries(settingsMap)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value, description: 'User overridden setting' }
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_SETTINGS',
        details: 'Site configuration variables successfully updated',
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin/settings', 'page');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// TRANSLATIONS CRUD
// ----------------------------------------------------

export async function getTranslations() {
  try {
    await enforcePermission('manage_content');
    return await prisma.translation.findMany();
  } catch (e) {
    return [];
  }
}

export async function updateTranslation(id: string, data: { uz: string; ru: string; en: string }) {
  try {
    const session = await enforcePermission('manage_content');
    const item = await prisma.translation.update({
      where: { id },
      data
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_TRANSLATION',
        details: `Updated translation key: '${item.key}'`,
        ipAddress: '127.0.0.1'
      }
    });

    revalidatePath('/[locale]', 'layout');
    return { success: true, item };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ----------------------------------------------------
// ACTIVITY LOG AUDITING
// ----------------------------------------------------

export async function getActivityLogs() {
  try {
    const session = await getSession();
    if (!session || session.role === 'user') return [];
    
    return await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    return [];
  }
}

// ----------------------------------------------------
// CUSTOM USER PROFILE & ACCOUNT PORTAL ACTIONS
// ----------------------------------------------------

export async function getCurrentUserAction() {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthenticated' };

    const user = await prisma.user.findUnique({
      where: { id: session.id }
    });

    if (!user) return { success: false, error: 'User not found' };

    // Safely remove sensitive password hash
    const { passwordHash: _, ...safeUser } = user;

    return { success: true, user: safeUser };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to retrieve profile' };
  }
}

export async function updateUserProfileAction(data: {
  username: string;
  email: string;
  phone: string;
  name?: string;
  avatar?: string;
  notificationSettings?: any;
}) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthenticated' };

    const { username, email, phone, name, avatar, notificationSettings } = data;

    // Check unique constraints if username is modified
    if (username !== session.username) {
      const exists = await prisma.user.findUnique({ where: { username } });
      if (exists) return { success: false, error: 'Username is already taken' };
    }

    // Check unique constraints if email is modified
    if (email !== session.email) {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return { success: false, error: 'Email is already registered' };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        username,
        email,
        phone,
        name,
        avatar,
        notificationSettings
      }
    });

    // Update active cookie session
    await setSessionCookie({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: session.role
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'USER_UPDATE_PROFILE',
        details: `Profile credentials updated successfully (email: ${email})`,
        ipAddress: '127.0.0.1'
      }
    });

    const { passwordHash: _, ...safeUser } = updatedUser;
    return { success: true, user: safeUser };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to update profile' };
  }
}

export async function changeUserPasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthenticated' };

    const { currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { id: session.id }
    });

    if (!user) return { success: false, error: 'User not found' };

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) return { success: false, error: 'Incorrect current password' };

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.id },
      data: { passwordHash: hashed }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: 'USER_CHANGE_PASSWORD',
        details: 'User password updated successfully',
        ipAddress: '127.0.0.1'
      }
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to change password' };
  }
}

export async function sendTelegramMessageAction(message: string) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || token.includes('placeholder') || chatId.includes('placeholder')) {
      console.log('Telegram Bot parameters not set or are placeholders. Simulating success locally.');
      return { success: true, simulated: true };
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🤖 BEXA Studio AI Chatbot:\n\n💬 Message: ${message}\n\n📅 Date: ${new Date().toLocaleString()}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telegram API Error: ${errorText}`);
    }

    return { success: true };
  } catch (e: any) {
    console.error('Failed to send Telegram message:', e);
    return { success: false, error: e.message || 'Telegram Transmission Failed' };
  }
}
