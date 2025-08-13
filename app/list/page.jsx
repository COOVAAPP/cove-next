"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ListPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let redirectTimer;

    const decide = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (!cancelled) setReady(true);
        return;
      }

      // Wait briefly (handles race with callback)
      redirectTimer = setTimeout(async () => {
        const { data: { session: s2 } } = await supabase.auth.getSession();
        if (s2) {
          if (!cancelled) setReady(true);
        } else {
          router.replace(`/login?redirect=${encodeURIComponent("/list")}`);
        }
      }, 1200);
    };

    // Keep listening — if session arrives after mount, unlock page
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          clearTimeout(redirectTimer);
          if (!cancelled) setReady(true);
        }
      }
    );

    decide();

    return () => {
      cancelled = true;
      clearTimeout(redirectTimer);
      authListener.subscription?.unsubscribe();
    };
  }, [router]);

  if (!ready) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>List Your Space</h1>
      <p>Authenticated. Render your form here.</p>
    </main>
  );
}

