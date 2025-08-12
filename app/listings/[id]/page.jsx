'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ListingDetail({ params }) {
  const { id } = params; // URL param
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('id,title,description,price_per_hour,location,image_url')
        .eq('id', id)
        .single();

      if (!mounted) return;
      if (error || !data) {
        router.replace('/'); // fallback if not found
        return;
      }
      setListing(data);
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [id, router]);

  if (loading) return (
    <main style={{ padding: 24 }}>Loading…</main>
  );

  const price =
    typeof listing.price_per_hour === 'number'
      ? `$${listing.price_per_hour}/hour`
      : '';

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>{listing.title}</h1>

      {/* Large hero image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          background: '#f3f3f3',
          border: '1px solid #eee',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 16
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.image_url || ''}
          alt={listing.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 600, color: '#111' }}>{price}</div>
        <div style={{ color: '#555' }}>📍 {listing.location || '—'}</div>
      </div>

      {/* Description */}
      <p style={{ lineHeight: 1.6, color: '#333', marginBottom: 20 }}>
        {listing.description || 'No description provided.'}
      </p>

      {/* Contact / Book */}
      <div style={{ display: 'flex', gap: 12 }}>
        <a
          href={`mailto:coovaapp@gmail.com?subject=Inquiry for ${encodeURIComponent(
            listing.title
          )}&body=Hi, I’m interested in booking this space. Listing ID: ${listing.id}`}
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          Contact Host
        </a>
        <button
          onClick={() => alert('Booking flow coming soon')}
          style={{
            background: '#111',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 6,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Book Now
        </button>
      </div>
    </main>
  );
}
