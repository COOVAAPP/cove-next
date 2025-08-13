// middleware.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const config = {
  matcher: ['/dashboard/:path*', '/list/:path*']
}

export function middleware(req) {
  const c = cookies()
  const hasSession =
    c.get('sb-access-token')?.value || c.get('sb:token')?.value

  if (!hasSession) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}