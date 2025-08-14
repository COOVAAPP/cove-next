"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Completing sign-in...");

  useEffect(() => {
    const run = async () => {
      try {
        const code = searchParams.get("code");
        const redirect = searchParams.get("redirect") || "/list";

        if (!code) {
          setMsg("Missing authorization code. Returning to login...");
          setTimeout(() => (window.location.href = "/login"), 1000);
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg("Sign-in failed. Redirecting to login...");
          setTimeout(() => (window.location.href = "/login"), 1000);
          return;
        }

        window.location.replace(redirect);
      } catch {
        setMsg("Unexpected error. Redirecting to login...");
        setTimeout(() => (window.location.href = "/login"), 1000);
      }
    };

    run();
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 460, margin: "60px auto", fontSize: 16 }}>
      {msg}
    </div>
  );
}