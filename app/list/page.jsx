'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const BUCKET = 'listing-images';

export default function ListYourSpacePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirect=/list');
        return;
      }
      setUser(session.user);
    })();
  }, [router]);

  const onSelectFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const createListing = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    let publicUrl = '';
    if (file) {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (upErr) {
        alert(`Upload failed: ${upErr.message}`);
        setSaving(false);
        return;
      }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      publicUrl = pub.publicUrl;
    }

    const { data, error } = await supabase
      .from('listings')
      .insert({
        owner_id: user.id,
        title,
        description,
        price_per_hour: price === '' ? null : Number(price),
        location,
        image_url: publicUrl,
      })
      .select('id')
      .single();

    if (error) {
      alert('Could not save: ' + error.message);
      setSaving(false);
      return;
    }

    router.push(`/listings/${data.id}`);
  };

  return (
    <main style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h1>List your space</h1>

      <form onSubmit={createListing} style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        <label>Title
          <input value={title} onChange={(e)=>setTitle(e.target.value)} required style={input} />
        </label>

        <label>Description
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={5} style={input} />
        </label>

        <label>Price per hour
          <input type="number" min="0" step="1" value={price} onChange={(e)=>setPrice(e.target.value)} style={input} />
        </label>

        <label>Location
          <input value={location} onChange={(e)=>setLocation(e.target.value)} style={input} />
        </label>

        <label>Cover photo
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </label>

        {preview ? <img src={preview} alt="preview" style={{ maxWidth: '100%', borderRadius: 8 }} /> : null}

        <button disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : 'Create listing'}</button>
      </form>
    </main>
  );
}

const input = { display: 'block', width: '100%', marginTop: 6, padding: 10, border: '1px solid #ddd', borderRadius: 6 };
const btnPrimary = { padding: '12px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };



