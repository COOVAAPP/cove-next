'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) {
    return <main style={{ padding: 24 }}>Loading...</main>;
  }

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not signed in</h1>
        <a href="/login">Go to login</a>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome</h1>
      <p>{user.email}</p>
      <button
        onClick={() =>
          supabase.auth.signOut().then(() => router.replace('/login'))
        }
        style={{
          marginTop: 12,
          background: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '10px 12px',
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </main>
  );
}
