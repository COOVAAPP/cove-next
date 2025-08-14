'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/**
 * Required so Next does not try to pre-render or cache this page.
 * (Fixes: "Invalid revalidate value '[object Object]'" and prerender errors)
 */
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function CallbackWorker() {
  const params = useSearchParams();

  useEffect(() => {
    (async () => {
      const code = params.get('code');
      const redirect = params.get('redirect') || '/';

      if (!code) {
        window.location.replace('/login');
        return;
      }

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          window.location.replace('/login');
          return;
        }
        // Success: go to the requested destination
        window.location.replace(redirect);
      } catch {
        window.location.replace('/login');
      }
    })();
  }, [params]);

  return (
    <div style={{ maxWidth: 460, margin: '60px auto', fontSize: 16 }}>
      Finishing sign‑in…
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 460, margin: '60px auto', fontSize: 16 }}>Finishing sign‑in…</div>}>
      <CallbackWorker />
    </Suspense>
  );
}