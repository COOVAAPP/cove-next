"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ListYourSpace() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.replace("/login?redirect=/list");
        return;
      }
      setReady(true);
      const sub = supabase.auth.onAuthStateChange((_e, session) => {
        if (!session) router.replace("/login?redirect=/list");
      });
      unsub = () => sub.data.subscription.unsubscribe();
    })();
    return () => unsub?.();
  }, [router]);

  if (!ready) return <p style={{ padding: 40 }}>Loading…</p>;

  return (
    <main style={{ maxWidth: 720, margin: "32px auto", padding: 16 }}>
      <h1>List your space</h1>
      <p>Signed in. (Form goes here.)</p>
    </main>
  );
}


