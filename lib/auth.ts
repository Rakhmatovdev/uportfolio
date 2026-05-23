import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { signJWT, verifyJWT } from './jwt';

const SESSION_COOKIE_NAME = 'bexa_session';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Password comparison
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session cookie helper
export async function setSessionCookie(user: { id: string; username: string; email: string; role: string }, rememberMe: boolean = false) {
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  // 7 days if rememberMe, otherwise session cookie
  const maxAge = rememberMe ? 86400 * 7 : 86400; // 1 day
  const token = await signJWT(payload, maxAge);
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? maxAge : undefined,
    path: '/'
  });
}

// Clear Session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  try {
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (e) {
    // Graceful fallback if delete is not supported in the active context
  }
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}

// Get user session in Server Components / API routes
export async function getSession(): Promise<{ id: string; username: string; email: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role
    };
  } catch (e) {
    return null;
  }
}
