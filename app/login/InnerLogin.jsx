"use client";

import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function InnerLogin() {
  const searchParams = useSearchParams();
  // ✅ Default to "/" (NOT /dashboard). If the navbar sent ?redirect=/list, it will use that.
  const redirect = searchParams.get("redirect") || "/";

  const signInWithGoogle = async () => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // ✅ Send the redirect we received to the callback route
        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
      },
    });
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1>Login</h1>
      <button
        onClick={signInWithGoogle}
        style={{
          background: "#2563eb",
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