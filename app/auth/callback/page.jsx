"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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
          setTimeout(() => {
            if (!cancelled) window.location.replace("/login");
          }, 800);
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg("Sign-in failed. Redirecting to login…");
          setTimeout(() => {
            if (!cancelled) window.location.replace("/login");
          }, 1000);
          return;
        }

        window.location.replace(redirect);
      } catch {
        setMsg("Unexpected error. Redirecting to login…");
        setTimeout(() => {
          if (!cancelled) window.location.replace("/login");
        }, 1000);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 460, margin: "60px auto", padding: 16, fontSize: 16 }}>
      {msg}
    </div>
  );
}
