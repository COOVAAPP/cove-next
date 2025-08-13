'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const qp = useSearchParams();
  const redirectPath = qp.get('redirect') || '/dashboard';

  // If you're already signed in, skip this page
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace(redirectPath);
    })();
  }, [router, redirectPath]);

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
      },
    });
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={handleGoogle}>Sign in with Google</button>
    </main>
  );
}


