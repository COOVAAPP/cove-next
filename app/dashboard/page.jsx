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
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) router.replace('/login');
      setUser(user);
      setLoading(false);
    };

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <main style={{ padding: 24 }}>Loading...</main>;
  }

  if (!user) {
    return <main style={{ padding: 24 }}>Not signed in</main>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome, {user.email}</h1>
    </main>
  );
}
<button onClick={() => supabase.auth.signOut().then(() => router.replace('/login'))}>
  Sign out
</button>
