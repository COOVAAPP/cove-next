'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ListYourSpace() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data?.session) {
        router.replace('/login');
        return;
      }
      setSession(data.session);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!session?.user) return;

    setError('');
    setSaving(true);

    const { data, error } = await supabase
      .from('listings')
      .insert({
        owner_id: session.user.id,
        title,
        description,
        price_per_hour: price ? Number(price) : null,
        location,
        image_url: imageUrl || null
      })
      .select('id')
      .single();

    setSaving(false);

    if (error) { setError(error.message); return; }

    router.push(`/listings/${data.id}`);
  }

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>List Your Space</h1>

      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>Price per hour ($)</div>
          <input
            type="number"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>Location</div>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <div style={{ fontWeight: 600 }}>Image URL (optional)</div>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        {error && <div style={{ color: '#b00020', marginBottom: 12 }}>{error}</div>}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '12px 16px',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Saving…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}

