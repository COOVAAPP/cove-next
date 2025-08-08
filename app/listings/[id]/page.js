'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ListingDetail(){
  const params = useParams();
  const [item,setItem]=useState(null);
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('listings').select('*').eq('id', params.id).single();
    setItem(data);
  })(); }, [params.id]);

  if(!item) return <main><p>Loading...</p></main>;
  return (<main>
    {item.image_url && <img className="img" style={{height:300}} src={item.image_url} alt={item.title}/>}
    <h2>{item.title}</h2>
    <div className="badge">{item.category}</div>
    <p style={{marginTop:8}}><b>${item.price}</b> / hour</p>
    {item.location && <p style={{color:'#374151'}}>📍 {item.location}</p>}
    {item.description && <p style={{marginTop:12}}>{item.description}</p>}
  </main>);
}
