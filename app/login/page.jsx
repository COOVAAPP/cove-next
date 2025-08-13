'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectPath}`,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Login</h1>
      <p>Sign in to access your account.</p>
      <button
        onClick={handleGoogleLogin}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4285F4',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}
