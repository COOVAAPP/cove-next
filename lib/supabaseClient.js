// lib/supabaseClient.js
'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  'https://opnqqloemtaaowfttafs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbnFxbG9lbXRhYW93ZnR0YWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Mjg4MjAsImV4cCI6MjA3MDIwNDgyMH0._JApGaHuUvihMx5Yfdgdf5kd8O3SmGMNa6er5duRzD4'
);

export default supabase;     // keeps existing default import usage working
export { supabase };         // optional named export





