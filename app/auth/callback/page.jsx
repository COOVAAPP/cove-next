"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Completing sign‑in…");

  useEffect(() => {
    (async () => {
      const redirect = searchParams.get("redirect") || "/list";
      const code = searchParams.get("code");

      if (!code) {
        // No auth code — go back to login with the intended redirect
        window.location.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
        return;
      }

      // Exchange the code for a session (browser cookies)
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMsg("Sign‑in failed. Returning to login…");
        setTimeout(() => {
          window.location.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
        }, 800);
        return;
      }

      // Safari: give the cookie/subtle storage a moment to settle
      await new Promise((r) => setTimeout(r, 400));

      // If session is already visible, go now
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.replace(redirect);
        return;
      }

      // Otherwise listen once, with a fallback
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        if (s) window.location.replace(redirect);
      });
      setTimeout(() => window.location.replace(redirect), 1500);
      return () => sub.subscription?.unsubscribe();
    })();
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 460, margin: "60px auto", fontSize: 16 }}>
      {msg}
    </div>
  );
}