// lib/supabaseClient.js
'use server';

import { cookies } from 'next/headers';
import { createServerClient, createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opnqqloemtaaowfttafs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbnFxbG9lbXRhYW93ZnR0YWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Mjg4MjAsImV4cCI6MjA3MDIwNDgyMH0._JApGaHuUvihMx5Yfdgdf5kd8O3SmGMNa6er5duRzD4';

export function createClientServer() {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookies().get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookies().set({ name, value, ...options });
        } catch {}
      },
      remove(name, options) {
        try {
          cookies().set({ name, value: '', ...options, maxAge: 0 });
        } catch {}
      },
    },
  });
}

export function createClientBrowser() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}




