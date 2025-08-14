import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const redirectPath = searchParams.get('redirect') || '/list';

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(redirectPath, req.url));
}