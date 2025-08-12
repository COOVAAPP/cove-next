'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ListPage() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data?.session ?? null)
      setLoading(false)
    }

    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>

  if (!session) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Login required</h1>
        <button
          style={{ background: '#2563eb', color: '#fff', padding: 12, borderRadius: 8, border: 'none' }}
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: `${window.location.origin}/list` }
            })
          }
        >
          Sign in with Google
        </button>
      </main>
    )
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>List your space</h1>
      {/* (We’ll put the upload form back after this is stable) */}
    </main>
  )
}
