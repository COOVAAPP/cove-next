"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Completing sign-in...");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const code = searchParams.get("code");
        const redirect = searchParams.get("redirect") || "/";

        if (!code) {
          setMsg("Missing authorization code. Returning to login…");
          setTimeout(() => (window.location.href = "/login"), 1200);
          return;
        }

        // Try exchange using code first
        let { error } = await supabase.auth.exchangeCodeForSession(code);
        // Some versions accept the full URL instead of just the code — try that if needed.
        if (error) {
          ({ error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          ));
        }
        if (error) {
          setMsg("Sign-in failed. Redirecting to login…");
          setTimeout(() => (window.location.href = "/login"), 1200);
          return;
        }

        // Poll up to 5s for a non-null session (covers Safari/Private timing)
        const start = Date.now();
        while (Date.now() - start < 5000) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) break;
          await new Promise((r) => setTimeout(r, 200));
        }

        if (!cancelled) window.location.replace(redirect);
      } catch {
        setMsg("Unexpected error. Redirecting to login…");
        setTimeout(() => (window.location.href = "/login"), 1200);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 460, margin: "60px auto", fontSize: 16 }}>
      {msg}
    </div>
  );
}