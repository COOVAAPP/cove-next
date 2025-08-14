// app/login/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';

export default function LoginPage() {
  const sp = useSearchParams();
  const redirectPath = sp.get('redirect') || '/list';
  const supabase = createClientBrowser();

  async function signIn() {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        queryParams: { prompt: 'select_account' },
      },
    });
  }

  return (
    <main style={{ maxWidth: 520, margin: '60px auto', padding: 16 }}>
      <h1>Login</h1>
      <button className="btn primary" onClick={signIn}>Sign in with Google</button>
    </main>
  );
}

