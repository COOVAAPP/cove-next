// app/list/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListYourSpacePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data?.user) router.replace('/login');
      else setUser(data.user);
    });
    return () => { mounted = false; };
  }, [router]);

  const cleanName = (name) => name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

  async function uploadImage() {
    if (!file) return null;
    const path = `${user.id}/${crypto.randomUUID()}-${cleanName(file.name)}`;
    const { error: upErr } = await supabase
      .storage
      .from('listing-images')
      .upload(path, file, { upsert: false, contentType: file.type || 'image/jpeg' });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from('listing-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const image_url = await uploadImage();

      const { data, error } = await supabase
        .from('listings')
        .insert({
          owner_id: user.id,
          title,
          description,
          price_per_hour: price ? Number(price) : null,
          location,
          image_url: image_url || null
        })
        .select('id')
        .single();

      if (error) throw error;
      router.push(`/listings/${data.id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error creating listing');
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>List Your Space</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Description
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1, marginBottom: 12 }}>
            Price per hour
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>

          <label style={{ flex: 1, marginBottom: 12 }}>
            Location
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>
        </div>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Cover image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              setPreview(f ? URL.createObjectURL(f) : '');
            }}
          />
        </label>

        {preview && (
          <div style={{ margin: '12px 0' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !user}
          style={{
            marginTop: 16,
            background: '#2563eb',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Saving…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}
