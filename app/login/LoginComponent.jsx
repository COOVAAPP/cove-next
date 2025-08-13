"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginComponent({ redirect = "/list" }) {
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
    <main style={{ maxWidth: 480, margin: "60px auto", padding: "0 16px" }}>
      <h1>Login</h1>
      <button
        onClick={signInWithGoogle}
        style={{
          background: "#1a73e8",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </main>
  );
}
}