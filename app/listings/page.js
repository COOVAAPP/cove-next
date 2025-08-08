'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ListingsPage(){
  const [q,setQ]=useState('');
  const [items,setItems]=useState([]);
  useEffect(()=>{ fetchAll(); }, []);

  async function fetchAll(){
    const { data } = await supabase.from('listings').select('*').order('created_at', { ascending:false });
    setItems(data ?? []);
  }

  const filtered = items.filter(i => (i.title||'').toLowerCase().includes(q.toLowerCase()));
  return (<main>
    <h2>All Listings</h2>
    <input placeholder="Search by title..." value={q} onChange={e=>setQ(e.target.value)} />
    <div className="grid">
      {filtered.map(l=>(
        <Link href={`/listings/${l.id}`} key={l.id} className="card">
          {l.image_url ? <img className="img" src={l.image_url} alt={l.title}/> : <div className="img" />}
          <h3 style={{margin:'10px 0 4px'}}>{l.title}</h3>
          <div className="badge">{l.category}</div>
          <div style={{marginTop:8}}>${l.price}</div>
        </Link>
      ))}
    </div>
  </main>);
}
