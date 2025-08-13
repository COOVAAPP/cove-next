// app/auth/callback/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * We don't do any rendering here. We just bounce back to the app.
 * Supabase finishes the OAuth in their hosted page, then redirects here.
 * We simply forward the user to the dashboard (or provided redirect).
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get('redirect') || '/dashboard';
  return NextResponse.redirect(new URL(redirect, req.url));
}


