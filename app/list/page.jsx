'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function ListYourSpacePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1) Require login
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes?.user) {
        setError('Please log in first.');
        setLoading(false);
        router.push('/login?redirect=/list');
        return;
      }
      const user = userRes.user;

      // 2) Upload image (optional)
      let publicUrl = '';
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${user.id}/${uuidv4()}.${ext}`;

        const { error: upErr } = await supabase
          .storage
          .from('listing-images')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'image/jpeg',
          });
        if (upErr) throw upErr;

        const { data: urlData } = supabase
          .storage
          .from('listing-images')
          .getPublicUrl(path);

        publicUrl = urlData.publicUrl;
      }

      // 3) Insert listing
      const { data: insertData, error: insErr } = await supabase
        .from('listings')
        .insert({
          owner_id: user.id,
          title,
          description,
          price_per_hour: Number(price) || 0,
          location,
          image_url: publicUrl || null,
        })
        .select('id')
        .single();

      if (insErr) throw insErr;

      // 4) Go to the new listing page
      router.push(`/listings/${insertData.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: '32px auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>List Your Space</h1>

      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 10 }}>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 10 }}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 10 }}>
          Price per hour (USD)
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 10 }}>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          Cover image (JPG/PNG)
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: 'block', marginTop: 6 }}
          />
        </label>

        {error ? (
          <div style={{ color: '#b00020', marginBottom: 16 }}>{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '12px 18px',
            fontWeight: 600,
            border: 'none',
            borderRadius: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}


