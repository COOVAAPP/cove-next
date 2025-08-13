'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = false; // dynamic; no ISR

export default function ListPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub;

    async function check() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace(`/login?redirect=${encodeURIComponent('/list')}`);
        return;
      }

      setReady(true);

      const { data } = supabase.auth.onAuthStateChange((_event, sess) => {
        if (!sess) {
          router.replace(`/login?redirect=${encodeURIComponent('/list')}`);
        } else {
          setReady(true);
        }
      });

      unsub = data?.subscription;
    }

    check();
    return () => {
      unsub?.unsubscribe();
    };
  }, [router]);

  if (!ready) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1>List Your Space</h1>
      <p>Authenticated. Render your form here.</p>
      {/* TODO: Replace this with the real listing form */}
    </main>
  );
}
