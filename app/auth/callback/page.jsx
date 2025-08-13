"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/list";

  useEffect(() => {
    (async () => {
      try {
        // Reads ?code=… from URL, sets the session in localStorage
        await supabase.auth.exchangeCodeForSession();
      } catch (e) {
        console.error("exchangeCodeForSession error:", e);
      } finally {
        router.replace(next);
      }
    })();
  }, [router, next]);

  return <p style={{ padding: 40 }}>Finishing sign‑in…</p>;
}