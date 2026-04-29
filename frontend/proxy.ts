import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MASTER FLOW CONTROLLER (MIDDLEWARE)
 * Handles:
 * 1. Public route access control
 * 2. Auth redirection (Login -> Dashboard)
 * 3. Guest redirection (Protected -> Login)
 */

const PUBLIC_ROUTES = ['/login', '/register', '/setup', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Skip checks for assets and internal Next.js paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Auth Check
  const token = request.cookies.get('accessToken')?.value;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Flow A: Guest trying to access protected content
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Flow B: Logged-in user trying to access Auth pages (/login, /register)
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Flow C: Already on setup but potentially logged in (let AuthProvider decide if setup is allowed)
  // We allow Setup to be public because initialization check is reactive/dynamic.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths for complete flow control
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
