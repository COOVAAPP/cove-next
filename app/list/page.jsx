'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListYourSpace() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session ?? null);
      setLoading(false);

      if (!data.session) router.replace('/login');
    };

    init();
    return () => {
      mounted = false;
    };
  }, [router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) return;

    setLoading(true);

    const { error } = await supabase.from('listings').insert({
      id: crypto.randomUUID(),
      owner_id: session.user.id,
      title,
      description: '',
      price_per_hour: Number(price) || 0,
      location,
      image_url: imageUrl || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push('/');
  };

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

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
          disabled={loading}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? 'Saving…' : 'Create Listing'}
        </button>
      </form>
    </main>
  );
}
