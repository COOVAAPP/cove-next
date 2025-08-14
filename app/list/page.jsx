// app/list/page.jsx
import { createClientServer } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';

export default async function ListPage() {
  const supabase = createClientServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent('/list')}`);
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1>List Your Space</h1>
      <p>Authenticated. Render your listing form here.</p>
    </main>
  );
}
