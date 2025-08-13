'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      setUser(session.user);

      const { data, error } = await supabase
        .from('listings')
        .select('id,title,price_per_hour,image_url,inserted_at')
        .eq('owner_id', session.user.id)
        .order('inserted_at', { ascending: false });

      if (!error) setRows(data || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  return (
    <main style={{ padding: 24, maxWidth: 920, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div>
          <Link href="/list" className="btn" style={btnPrimary}>Create listing</Link>{' '}
          <button onClick={signOut} style={btnDanger}>Sign out</button>
        </div>
      </header>

      <h3 style={{ marginTop: 24 }}>My listings</h3>
      {rows.length === 0 && <p>No listings yet.</p>}

      <ul style={grid}>
        {rows.map((r) => (
          <li key={r.id} style={card}>
            <Link href={`/listings/${r.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <div style={{ aspectRatio: '16/10', background: '#f3f4f6' }}>
                {r.image_url ? (
                  <img src={r.image_url} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
              </div>
              <div style={{ padding: 12 }}>
                <strong>{r.title}</strong>
                <div style={{ color: '#555', marginTop: 6 }}>${Number(r.price_per_hour || 0)} / hour</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, listStyle: 'none', padding: 0 };
const card = { border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff' };
const btnPrimary = { padding: '10px 14px', background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 600 };
const btnDanger  = { padding: '10px 14px', background: '#e11d48', color: '#fff', borderRadius: 8, fontWeight: 600, border: 'none' };

