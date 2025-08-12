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
      <h2>Latest Listings . v2</h2>
      <div className="grid">
        {listings.map((l)=>(
          <Link href={`/listings/${l.id}`} key={l.id} className="card">
            {l.image_url ? <img className="img" src={l.image_url} alt={l.title}/> : <div className="img" />}
            <h3 style={{margin:'10px 0 4px'}}>{l.title}</h3>
            <div className="badge">{l.category}</div>
            <div style={{marginTop:8}}>${l.price}</div>
          </Link>
        ))}
      </div>
    </section>
  </main>);
}
