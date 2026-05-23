import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';
import { verifyJWT } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static assets, public files, next internal paths, etc.
  const isInternal = pathname.startsWith('/_next') || 
                     pathname.startsWith('/api') || 
                     pathname.includes('.') || 
                     pathname === '/favicon.ico';

  if (isInternal) return;

  // Check if pathname starts with any of the supported locales
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  let locale = 'en';
  let restOfPath = pathname;

  if (pathnameHasLocale) {
    const parts = pathname.split('/');
    locale = parts[1];
    restOfPath = '/' + parts.slice(2).join('/');
  } else {
    // Detect language or default to en
    const acceptLanguage = request.headers.get('accept-language') || '';
    if (acceptLanguage.includes('ru')) {
      locale = 'ru';
    } else if (acceptLanguage.includes('uz')) {
      locale = 'uz';
    }
    
    // Redirect to the appropriate locale path
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Admin Route Protection
  const isAdminPath = restOfPath === '/admin' || restOfPath.startsWith('/admin/');
  const isAdminLoginPath = restOfPath === '/admin/login';

  if (isAdminPath && !isAdminLoginPath) {
    const token = request.cookies.get('bexa_session')?.value;

    if (!token) {
      // Redirect to admin login if no session is present
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      // Redirect to admin login if token is invalid or expired
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.set('bexa_session', '', { maxAge: 0 });
      return response;
    }

    // Role-Based Access Protection in middleware: standard 'user' role is blocked from admin dashboard
    const userRole = payload.role;
    if (userRole === 'user') {
      const unauthorizedUrl = new URL(`/${locale}/admin/unauthorized`, request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Protect regular user dashboard paths or profile if we had any, but for now, we just proceed
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static assets
    '/((?!_next|api|.*\\..*).*)',
  ],
};
