'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [msg, setMsg] = useState('Finishing sign-in…');

  useEffect(() => {
    const run = async () => {
      try {
        // 1) Exchange ?code for a session (required for OAuth v2)
        const { error: exErr } = await supabase.auth.exchangeCodeForSession({
          // Use the full query string (e.g. ?code=...&state=...)
          queryString: window.location.search,
        });
        if (exErr) {
          console.error('[callback] exchange error:', exErr);
          setMsg('Sign-in failed. Redirecting to login…');
          setTimeout(() => router.replace('/login'), 1200);
          return;
        }

        // 2) Confirm we actually have a session
        const { data: { session }, error: sessErr } = await supabase.auth.getSession();
        if (sessErr || !session) {
          console.error('[callback] no session:', sessErr);
          setMsg('No session found. Redirecting to login…');
          setTimeout(() => router.replace('/login'), 1200);
          return;
        }

        // 3) Success -> go where the user was headed (default /dashboard)
        router.replace(redirectPath);
      } catch (e) {
        console.error('[callback] unexpected:', e);
        setMsg('Unexpected error. Redirecting to login…');
        setTimeout(() => router.replace('/login'), 1200);
      }
    };

    run();
  }, [router, redirectPath]);

  return <main style={{ padding: 24 }}>{msg}</main>;
}

