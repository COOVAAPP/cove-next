"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Completing sign-in...");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const code = searchParams.get("code");
        const redirect = searchParams.get("redirect") || "/";

        if (!code) {
          setMsg("Missing authorization code.");
          setTimeout(() => (window.location.href = "/login"), 1500);
          return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg("Sign-in failed.");
          setDetails({ error: error.message });
          // stay here so we can read the error
          return;
        }

        setMsg("Success — redirecting...");
        setDetails({ user: data?.user ?? null });
        setTimeout(() => window.location.replace(redirect), 400);
      } catch (e) {
        setMsg("Unexpected error.");
        setDetails({ error: String(e) });
      }
    };

    run();
  }, [searchParams]);

  return (
    <main style={{ maxWidth: 680, margin: "60px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
      <h2>/auth/callback</h2>
      <p>{msg}</p>
      {details && (
        <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 8, overflowX: "auto" }}>
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
      <p style={{ marginTop: 16 }}>
        If this page gets stuck, copy the error above and send it to me.
      </p>
    </main>
  );
}