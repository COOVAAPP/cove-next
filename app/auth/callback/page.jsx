'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = false; // dynamic; no ISR

function CallbackInner() {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState('Completing sign-in…');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const code = searchParams.get('code');
        const redirect = searchParams.get('redirect') || '/list';

        if (!code) {
          setMsg('Missing authorization code. Returning to login…');
          setTimeout(() => {
            if (!cancelled) window.location.replace('/login');
          }, 900);
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg('Sign-in failed. Redirecting to login…');
          setTimeout(() => {
            if (!cancelled) window.location.replace('/login');
          }, 900);
          return;
        }

        // Success — go where we intended
        window.location.replace(redirect);
      } catch {
        setMsg('Unexpected error. Redirecting to login…');
        setTimeout(() => {
          if (!cancelled) window.location.replace('/login');
        }, 900);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 460, margin: '60px auto', fontSize: 16 }}>
      {msg}
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 460, margin: '60px auto' }}>Completing sign-in…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
