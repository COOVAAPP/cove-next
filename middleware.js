import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {
  const protectedRoutes = ['/dashboard', '/list'];
  const pathname = req.nextUrl.pathname;

  // Check if this route is protected
  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route));

  if (needsAuth) {
    const sbToken = cookies().get('sb-access-token')?.value || cookies().get('sb:token')?.value;

    if (!sbToken) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/list/:path*'],
};

