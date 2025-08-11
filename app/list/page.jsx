'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListYourSpace() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!session) {
        router.replace('/login');
        return;
      }

      setSession(session);

      // ensure profile row exists (FK on listings.owner_id)
      await supabase.from('profiles').upsert(
        { id: session.user.id },
        { onConflict: 'id' }
      );

      setLoading(false);
    };

    load();
    return () => { mounted = false; };
  }, [router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!session?.user?.id) throw new Error('Not authenticated');
      if (!title || !price || !location) throw new Error('Missing required fields');
      if (!file) throw new Error('Please choose an image');

      // 1) Upload image to public bucket
      const path = `${session.user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase
        .storage
        .from('listing-images')
        .upload(path, file, { upsert: false });

      if (upErr) throw upErr;

      // 2) Get public URL
      const { data: pub } = supabase
        .storage
        .from('listing-images')
        .getPublicUrl(path);

      const imageUrl = pub?.publicUrl;
      if (!imageUrl) throw new Error('Could not get image URL');

      // 3) Insert listing
      const { error: insErr } = await supabase.from('listings').insert({
        id: crypto.randomUUID(),
        owner_id: session.user.id,
        title,
        description,
        price_per_hour: Number(price),
        location,
        image_url: imageUrl
      });

      if (insErr) throw insErr;

      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to save listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main style={{ padding: 24 }}>Loading…</main>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>List Your Space</h1>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #f99', padding: 12, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label>
          Title<br />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
          />
        </label>

        <label>
          Description<br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
          />
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            Price per hour ($)<br />
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
            />
          </label>

          <label style={{ flex: 1 }}>
            Location<br />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
            />
          </label>
        </div>

        <label>
          Cover image (JPEG/PNG)<br />
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{ marginTop: 6, marginBottom: 16 }}
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '10px 16px', background: '#3b82f6', color: 'white', border: 0, borderRadius: 6 }}
          >
            {saving ? 'Saving…' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </main>
  );
}
