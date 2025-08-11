'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListYourSpacePage() {
  const router = useRouter();

  // session gate
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  // form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.replace('/login');
        return;
      }
      setUser(data.session.user);
      setAuthChecked(true);
    })();
  }, [router]);

  if (!authChecked) {
    return <main style={{ padding: 24 }}>Checking session…</main>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSaving(true);

    try {
      let image_url = null;

      if (file) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase
          .storage
          .from('listing-images')
          .upload(path, file, { contentType: file.type, upsert: false });

        if (upErr) throw upErr;

        const { data: pub } = supabase
          .storage
          .from('listing-images')
          .getPublicUrl(path);

        image_url = pub.publicUrl;
      }

      const { data: inserted, error: insErr } = await supabase
        .from('public.listings')
        .insert({
          owner_id: user.id,
          title,
          description,
          price_per_hour: pricePerHour ? Number(pricePerHour) : null,
          location,
          image_url,
        })
        .select('id')
        .single();

      if (insErr) throw insErr;

      router.push(`/listings/${inserted.id}`);
    } catch (e) {
      setErr(e.message ?? 'Error creating listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>List Your Space</h1>

      {err && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Rooftop Lounge"
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe your space, features, rules…"
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            Price per hour (USD)
            <input
              type="number"
              min="0"
              step="1"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              placeholder="85"
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="City, State"
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>
        </div>

        <label style={{ display: 'grid', gap: 6 }}>
          Cover image (JPEG/PNG)
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Creating…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}

