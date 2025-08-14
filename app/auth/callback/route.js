// app/auth/callback/route.js
import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/list';

  if (code) {
    const supabase = createClientServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Always finish at the requested page
  return NextResponse.redirect(new URL(redirect, request.url));
}