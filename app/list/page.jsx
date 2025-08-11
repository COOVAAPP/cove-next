'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListYourSpace() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc]   = useState('');
  const [price, setPrice] = useState('');
  const [loc, setLoc]     = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      let imageUrl = '';
      const file = fileRef.current?.files?.[0];
      if (file) {
        const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
        const { error: upErr } = await supabase
          .storage.from('listing-images')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('listing-images').getPublicUrl(path);
        imageUrl = pub.publicUrl;
      }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          id: crypto.randomUUID(),
          owner_id: user.id,
          title,
          description: desc,
          price_per_hour: Number(price) || null,
          location: loc,
          image_url: imageUrl
        })
        .select('id')
        .single();
      if (error) throw error;

      router.push(`/listings/${data.id}`);
    } catch (e2) {
      setErr(e2.message ?? 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>List Your Space</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title (e.g., Modern Studio Loft)"
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
          rows={4}
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price per hour"
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input
          value={loc}
          onChange={e => setLoc(e.target.value)}
          placeholder="Location (City, ST)"
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />

        <input type="file" ref={fileRef} accept="image/*" />

        {err && <div style={{ color: 'crimson' }}>{err}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 6,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Uploading…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}

