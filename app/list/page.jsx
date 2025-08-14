'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function ListPage() {
  const supabase = createClient();
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price_per_hour: '',
    location: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirect=/list');
        return;
      }
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (s) {
        setSession(s);
        setLoading(false);
      }
    });

    init();
    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, [router, supabase]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!session) return;

    try {
      setLoading(true);

      let image_url = null;
      if (file) {
        const path = `${session.user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage
          .from('listing-images')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;

        const { data } = supabase.storage.from('listing-images').getPublicUrl(path);
        image_url = data.publicUrl;
      }

      const { data: row, error: insErr } = await supabase
        .from('listings')
        .insert({
          owner_id: session.user.id,
          title: form.title,
          description: form.description,
          price_per_hour: form.price_per_hour ? Number(form.price_per_hour) : null,
          location: form.location,
          image_url
        })
        .select('id')
        .single();

      if (insErr) throw insErr;
      router.replace(`/listings/${row.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message ?? 'Failed to create listing');
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <main style={{ maxWidth: 720, margin: '32px auto', padding: '0 16px' }}>
      <h1>List Your Space</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Price / hour (USD)
            <input
              type="number"
              step="0.01"
              value={form.price_per_hour}
              onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })}
            />
          </label>
          <label>Location
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </label>
        </div>
        <label>Photo
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}