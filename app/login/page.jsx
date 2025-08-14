'use client';

import { createClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    const origin = window.location.origin;
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('redirect') || '/list';

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`
      }
    });
  };

  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'60vh' }}>
      <div style={{ display:'grid', gap:12 }}>
        <h1>Login</h1>
        <button className="btn primary" onClick={handleLogin}>Sign in with Google</button>
      </div>
    </main>
  );
}

