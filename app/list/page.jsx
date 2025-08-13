"use client";

// Prevent any static caching/prerender issues
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ListPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub;

    (async () => {
      // If we already have a session, render immediately
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
        return;
      }

      // Listen for session that arrives right after the callback
      unsub = supabase.auth.onAuthStateChange((_evt, s) => {
        if (s) setReady(true);
      }).data.subscription;

      // Not logged in — send to login and come back to /list
      router.replace(`/login?redirect=${encodeURIComponent("/list")}`);
    })();

    return () => unsub?.unsubscribe();
  }, [router]);

  if (!ready) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>List Your Space</h1>
      <p>Authenticated. Render your form here.</p>
    </main>
  );
}

