'use client'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/dashboard`
      }
    })
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button
        onClick={signInWithGoogle}
        style={{ padding: '10px 20px', background: '#4285F4', color: '#fff', border: 'none', borderRadius: 4 }}
      >
        Sign in with Google
      </button>
    </main>
  )
}