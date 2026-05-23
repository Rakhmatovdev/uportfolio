export type RoleType = 'super_admin' | 'admin' | 'editor' | 'moderator' | 'user';

export type PermissionType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'publish' 
  | 'manage_users' 
  | 'manage_roles' 
  | 'manage_settings' 
  | 'manage_content';

// Fast, compiled static mapping for RBAC guards
export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
  super_admin: [
    'create',
    'update',
    'delete',
    'publish',
    'manage_users',
    'manage_roles',
    'manage_settings',
    'manage_content'
  ],
  admin: [
    'create',
    'update',
    'publish',
    'manage_content',
    'manage_settings'
  ],
  editor: [
    'create',
    'update',
    'publish',
    'manage_content'
  ],
  moderator: [
    'update',
    'manage_content'
  ],
  user: [] // Standard users have read-only or self-oriented operations
};

// Labels and metadata for presentation in CMS Dashboard
export const ROLE_METADATA: Record<RoleType, { name: string; description: string; color: string }> = {
  super_admin: {
    name: 'Super Administrator',
    description: 'Complete, unrestricted administrative control over the entire system.',
    color: 'bg-red-500/10 text-red-500 border-red-500/20'
  },
  admin: {
    name: 'Administrator',
    description: 'Manage users, settings, and general contents, without core system modifications.',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  },
  editor: {
    name: 'Content Editor',
    description: 'Write, edit, delete, and publish portfolio, news, FAQ, and team contents.',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  moderator: {
    name: 'Moderator',
    description: 'Monitor activities, modify records, and manage public comment metrics.',
    color: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
  },
  user: {
    name: 'Registered User',
    description: 'Standard viewer account with access to personalized profiles and bookmarks.',
    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  }
};

export const PERMISSION_METADATA: Record<PermissionType, { name: string; description: string }> = {
  create: {
    name: 'Create',
    description: 'Allows creating new portfolio projects, news articles, team cards, or FAQs.'
  },
  update: {
    name: 'Update',
    description: 'Allows modifying existing system settings or database records.'
  },
  delete: {
    name: 'Delete',
    description: 'Allows removing records permanently from database.'
  },
  publish: {
    name: 'Publish',
    description: 'Allows publishing draft contents to make them visible to website visitors.'
  },
  manage_users: {
    name: 'Manage Users',
    description: 'Allows viewing, adding, editing roles, or suspending general users.'
  },
  manage_roles: {
    name: 'Manage Roles',
    description: 'Allows modifying roles, mapping, and granular security privileges.'
  },
  manage_settings: {
    name: 'Manage Settings',
    description: 'Allows altering hero sections, SEO headers, contact details, and social links.'
  },
  manage_content: {
    name: 'Manage Content',
    description: 'Allows general content curation, SEO tags updates, and translation editing.'
  }
};

/**
 * Check if a role is authorized to perform a specific action
 */
export function hasPermission(role: string | undefined, permission: PermissionType): boolean {
  if (!role) return false;
  const normalizedRole = role.toLowerCase() as RoleType;
  const permissionsList = ROLE_PERMISSIONS[normalizedRole];
  if (!permissionsList) return false;
  return permissionsList.includes(permission);
}

/**
 * Check if a user's role satisfies a minimum level or matching set
 */
export function hasRole(userRole: string | undefined, allowedRoles: RoleType[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole.toLowerCase() as RoleType);
}
