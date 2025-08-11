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
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) router.replace('/login');
      else setUser(user);
      setLoading(false);
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) router.replace('/login');
      else setUser(session.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as <strong>{user?.email}</strong></p>
      <button onClick={signOut} style={{ marginTop: 12 }}>Sign out</button>
    </main>
  );
}