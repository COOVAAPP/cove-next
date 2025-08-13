"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Completing sign‑in…");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const code = searchParams.get("code");
        const redirect = searchParams.get("redirect") || "/";

        if (!code) {
          if (!active) return;
          setMsg("Missing authorization code. Returning to login…");
          setTimeout(() => (window.location.href = "/login"), 1200);
          return;
        }

        // Exchange OAuth code for a session in the browser
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!active) return;
          setMsg("Sign‑in failed. Redirecting to login…");
          setTimeout(() => (window.location.href = "/login"), 1200);
          return;
        }

        // Success — go where the app asked
        window.location.replace(redirect);
      } catch {
        if (!active) return;
        setMsg("Unexpected error. Redirecting to login…");
        setTimeout(() => (window.location.href = "/login"), 1200);
      }
    })();

    return () => {
      active = false;
    };
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 460, margin: "60px auto", fontSize: 16 }}>
      {msg}
    </div>
  );
}
