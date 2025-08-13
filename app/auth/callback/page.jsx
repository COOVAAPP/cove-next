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
        // Exchange `code` for a session
        const { error: exErr } = await supabase.auth.exchangeCodeForSession({
          queryString: window.location.search,
        });
        if (exErr) {
          console.error('[callback] exchange error:', exErr);
          setMsg('Sign-in failed. Redirecting to login…');
          setTimeout(() => router.replace('/login'), 1200);
          return;
        }

        // Verify a session exists
        const { data: { session }, error: sErr } = await supabase.auth.getSession();
        if (sErr || !session) {
          console.error('[callback] no session:', sErr);
          setMsg('No session found. Redirecting to login…');
          setTimeout(() => router.replace('/login'), 1200);
          return;
        }

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

