'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ListingDetailPage({ params }) {
  const { id } = params;
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('id,title,description,price_per_hour,location,image_url')
        .eq('id', id)
        .single();

      if (!error) setRow(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (!row)    return <main style={{ padding: 24 }}>Listing not found.</main>;

  return (
    <main style={{ padding: 24, maxWidth: 920, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 10 }}>{row.title}</h1>

      <div style={{ aspectRatio: '16/9', background: '#f3f4f6', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        {row.image_url ? (
          <img src={row.image_url} alt={row.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>

      <div style={{ color:'#444', marginBottom: 8 }}>
        <strong>${row.price_per_hour || 0}</strong> / hour
      </div>
      <div style={{ marginBottom: 12 }}>📍 {row.location}</div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{row.description}</p>
    </main>
  );
}




