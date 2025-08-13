'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home(){
  const [listings,setListings] = useState([]);
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('listings').select('*').order('created_at', { ascending:false }).limit(8);
    setListings(data ?? []);
  })(); }, []);

  return (<main>
    <section className="hero">
      <h1>Rent Luxury. Share Vibes.</h1>
      <p>Spaces, cars, venues — all in one place.</p>
      <p><Link className="btn primary" href="/listings">Browse Listings</Link></p>
    </section>
    <section>
      <h2>Latest Listings</h2>
      <div className="grid">
        {listings.map((l) => (
  <div key={l.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
    <a href={`/listings/${l.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      {l.image_url ? (
        <img
          src={l.image_url}
          alt={l.title}
          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }}
        />
      ) : (
        <div style={{ width: '100%', height: 180, background: '#f1f5f9', borderRadius: 6 }} />
      )}
      <h3 style={{ marginTop: 10 }}>{l.title}</h3>
    </a>

    <div style={{ color: '#555' }}>{l.location || ''}</div>
    {typeof l.price_per_hour === 'number' && (
      <div style={{ marginTop: 6, fontWeight: 600 }}>${l.price_per_hour}</div>
    )}
  </div>
))}
      </div>
    </section>
  </main>);
}
