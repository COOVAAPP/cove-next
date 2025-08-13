'use client';

export const revalidate = 60; // optional, safe to keep if you want ISR

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// ---- Your existing component code below ----
export default function Home() {
  // You can keep any hooks/state you already have
  // (If you don't need supabase/useEffect here, you can remove them.)
  return (
    <main style={{ maxWidth: 1100, margin: '40px auto', padding: '0 16px' }}>
      <section style={{ textAlign: 'center', margin: '32px 0 40px' }}>
        <h1 style={{ marginBottom: 8 }}>Rent Luxury. Share Vibes.</h1>
        <p>Spaces, cars, venues — all in one place.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
          <Link className="btn primary" href="/browse">Browse Listings</Link>
          <Link className="btn" href="/list">List Your Space</Link>
        </div>
      </section>

      <h2 style={{ margin: '24px 0 12px' }}>Latest Listings . v2</h2>
      {/* keep or replace with your grid */}
      <div style={{ border: '1px dashed #ddd', padding: 16, borderRadius: 8 }}>
        {/* TODO: render real listings here */}
        <div>Coming soon…</div>
      </div>
    </main>
  );
}