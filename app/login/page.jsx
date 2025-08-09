'use client'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          `${process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')}/dashboard`
      }
    })
  }

  return (
    <main style={{display:'grid',placeItems:'center',minHeight:'70vh'}}>
      <div style={{textAlign:'center'}}>
        <h1>Sign in</h1>
        <p>Use your Google account to continue.</p>
        <button onClick={signInWithGoogle} style={{padding:'10px 16px', marginTop: 12}}>
          Continue with Google
        </button>
      </div>
    </main>
  )
}
'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button
        onClick={signInWithGoogle}
        style={{
          background: '#4285F4',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Login with Google
      </button>
    </main>
  );
}