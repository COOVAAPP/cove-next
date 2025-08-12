'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListYourSpace() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ---- Auth gate (never hangs, always clears loading)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('getSession error:', error);
        if (cancelled) return;

        const u = data?.session?.user ?? null;
        setUser(u);
        setLoading(false);

        if (!u) router.replace('/login');
      } catch (e) {
        console.error('getSession threw:', e);
        if (!cancelled) setLoading(false);
      }
    };

    load();

    // also react to future changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (cancelled) return;
      const u = sess?.user ?? null;
      setUser(u);
      if (!u) router.replace('/login');
    });

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
    if (!user) {
      router.replace('/login');
      return;
    }
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

    if (error) {
      alert(error.message);
      return;
    }
    router.push('/');
  };

  // ---- UI
  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  if (!user) {
    // Fallback in case redirect didn’t happen
    return (
      <main style={{ padding: 24 }}>
        <h2>You need to sign in</h2>
        <p>
          <a href="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
            Go to Login
          </a>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      <h1>List Your Space</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Title
          <br />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Price per hour (USD)
          <br />
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Location
          <br />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Cover image URL (optional)
          <br />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            style={{ width: '100%', padding: 8 }}
          />
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
