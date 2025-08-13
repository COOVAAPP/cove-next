"use client";

import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function InnerLogin() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const signInWithGoogle = async () => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
      },
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Login</h1>
      <button
        onClick={signInWithGoogle}
        style={{
          background: "#1a73e8",
          color: "white",
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}