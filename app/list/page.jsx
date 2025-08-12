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
  const [imageUrl, setImageUrl] = useState('');

  // Load / watch auth session and stop the spinner in all cases
  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data?.session) {
        setLoading(false);            // stop spinner
        router.replace('/login');     // bounce to login
        return;
      }

      setSession(data.session);
      setLoading(false);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (!active) return;
      if (!sess) {
        setSession(null);
        setLoading(false);
        router.replace('/login');
        return;
      }
      setSession(sess);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [router]);

  if (loading) {
    return <main style={{ padding: 24 }}>Loading…</main>;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          owner_id: session.user.id,
          title,
          description,
          price_per_hour: Number(price) || 0,
          location,
          image_url: imageUrl
        }
      ])
      .select('id')
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/listings/${data.id}`);
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>List Your Space</h1>

      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Price per hour (USD)
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          Cover Image URL (JPEG/PNG)
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
