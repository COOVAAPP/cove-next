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