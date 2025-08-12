'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import * as SB from '@/lib/supabaseClient';

// ---- Robust client resolver (works whether you exported default or named)
const supabase =
  SB.default ??
  SB.supabase ??
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );

export default function ListYourSpace() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ---- Auth gate (never throws, never hangs)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (!supabase) throw new Error('Supabase client unavailable');

        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('getSession error:', error);

        if (cancelled) return;
        const u = data?.session?.user ?? null;
        setUser(u);
        setLoading(false);

        if (!u) router.replace('/login');
      } catch (e) {
        console.error('getSession threw:', e);
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    load();

    const { data: sub } =
      supabase?.auth?.onAuthStateChange?.((_evt, sess) => {
        if (cancelled) return;
        const u = sess?.user ?? null;
        setUser(u);
        if (!u) router.replace('/login');
      }) ?? { data: null };

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, [router]);

  // ---- Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return router.replace('/login');
    if (!supabase) return alert('Supabase client not ready.');

    setSaving(true);
    const { error } = await supabase.from('listings').insert({
      id: crypto.randomUUID(),
      owner_id: user.id,
      title,
      description: '',
      price_per_hour: Number(price) || 0,
      location,
      image_url: imageUrl || null,
    });
    setSaving(false);

    if (error) return alert(error.message);
    router.push('/');
  };

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (!user)
    return (
      <main style={{ padding: 24 }}>
        <h2>You need to sign in</h2>
        <a href="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Go to Login</a>
      </main>
    );

  return (
    <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      <h1>List Your Space</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Title<br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Price per hour (USD)<br />
          <input type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Location<br />
          <input value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Cover image URL (optional)<br />
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" style={{ width: '100%', padding: 8 }} />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}
