import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/login', '/register', '/api/auth', '/api/scan', '/result', '/scan'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isRoot = pathname === '/';
  const isPublic = isRoot || PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const session = await auth.api.getSession({ headers: request.headers });
  const isAuthenticated = !!session;

  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname === r)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
