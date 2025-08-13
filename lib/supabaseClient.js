import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://opnqqloemtaaowfttafs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbnFxbG9lbXRhYW93ZnR0YWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Mjg4MjAsImV4cCI6MjA3MDIwNDgyMH0._JApGaHuUvihMx5Yfdgdf5kd8O3SmGMNa6er5duRzD4',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);





