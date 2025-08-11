import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
  const session = cookies().get('sb:token') || cookies().get('sb-access-token');
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
