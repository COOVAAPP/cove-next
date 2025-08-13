'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        router.push('/login');
        return;
      }
      router.push(redirectPath);
    };

    handleAuth();
  }, [router, redirectPath]);

  return <p>Signing you in...</p>;
}
