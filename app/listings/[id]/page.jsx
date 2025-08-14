import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ListingDetail({ params }) {
  const supabase = createClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!listing) notFound();

  return (
    <main style={{ maxWidth: 880, margin: '32px auto', padding: '0 16px' }}>
      <h1>{listing.title}</h1>
      {listing.image_url && (
        <img
          src={listing.image_url}
          alt={listing.title}
          style={{ maxWidth: '100%', borderRadius: 8, marginTop: 12 }}
        />
      )}
      <p style={{ marginTop: 12 }}>{listing.description}</p>
      <p><b>Location:</b> {listing.location ?? '-'}</p>
      <p><b>Price/hour:</b> {listing.price_per_hour ?? '-'}</p>
    </main>
  );
}




