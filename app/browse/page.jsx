'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabaseClient'

export default function Browse() {
  const [items, setItems] = useState([])

  useEffect(() => {
    supabase.from('listings').select('*').order('inserted_at', { ascending: false })
      .then(({ data }) => setItems(data ?? []))
  }, [])

  return (
    <main style={{ padding: '24px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <h1 style={{ margin: '8px 0 16px' }}>Browse Listings</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {items.map(l => (
            <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
                {l.image_url && <img src={l.image_url} alt={l.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>{l.title}</div>
                  <div style={{ color: '#666', fontSize: 14 }}>{l.location}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
