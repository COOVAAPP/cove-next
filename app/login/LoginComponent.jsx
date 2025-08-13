"use client";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function LoginComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const redirect = searchParams.get("redirect") || "/dashboard";

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) router.replace(redirect);
  }, [router, redirect]);

  useEffect(() => { checkSession(); }, [checkSession]);

  const login = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setBusy(false);
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "80px auto", padding: 24 }}>
      <h1>Login</h1>
      <button
        onClick={login}
        disabled={busy}
        style={{
          marginTop: 16,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {busy ? "Opening Google…" : "Sign in with Google"}
      </button>
    </div>
  );
}