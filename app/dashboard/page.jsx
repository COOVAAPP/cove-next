'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <main style={{padding:24}}>
        <h1>Not signed in</h1>
        <a href="/login">Go to login</a>
      </main>
    )
  }

  const user = session.user
  return (
    <main style={{padding:24}}>
      <h1>Welcome 👋</h1>
      <p>Email: {user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </main>
  )
}
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    });
  }, [supabase, router]);

  if (!user) return <p>Loading...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome {user.email}</h1>
      <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}>
        Sign Out
      </button>
    </main>
  );
}