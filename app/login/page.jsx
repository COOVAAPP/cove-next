export const dynamic = "force-dynamic";
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get('redirect') || '/dashboard';

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) router.replace(redirect);
    });
    return () => authListener.subscription.unsubscribe();
  }, [redirect, router]);

  const onClick = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={onClick}>Sign in with Google</button>
    </main>
  );
}


