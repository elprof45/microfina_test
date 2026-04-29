import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/setup', '/'];

export function proxy(request: NextRequest) {
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

  // Flow B: Logged-in user trying to access Auth pages
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};