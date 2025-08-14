import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  if (typeof window === 'undefined') {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (key) => cookies().get(key)?.value,
          set: (key, value, options) => cookies().set(key, value, options),
          remove: (key, options) => cookies().set(key, '', { ...options, maxAge: 0 })
        }
      }
    );
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};




