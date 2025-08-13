"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ListPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Not logged in — send to login with redirect back to /list
        router.replace(`/login?redirect=${encodeURIComponent("/list")}`);
        return;
      }

      if (!cancelled) setReady(true);
    }

    // Also listen in case session arrives after callback
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) setReady(true);
      }
    );

    check();
    return () => {
      cancelled = true;
      authListener.subscription?.unsubscribe();
    };
  }, [router]);

  if (!ready) return <div style={{ padding: 24 }}>Loading…</div>;

  // ====== Your listing form goes here ======
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>List Your Space</h1>
      <p>Authenticated. Render your form here.</p>
    </main>
  );
}


