// app/auth/callback/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic' // prevent static prerender

export async function GET(req) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const redirectTo = url.searchParams.get('redirect') || '/dashboard'

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options })
        }
      }
    }
  )

  if (code) {
    // sets sb-access-token / sb-refresh-token cookies
    await supabase.auth.exchangeCodeForSession(code)
  }

  const dest = new URL(redirectTo, req.url) // supports absolute or relative
  return NextResponse.redirect(dest)
}


