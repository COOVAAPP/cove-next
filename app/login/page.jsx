"use client";

import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/list";

  const signIn = async () => {
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
    <main style={{ maxWidth: 520, margin: "60px auto", padding: 24 }}>
      <h1>Login</h1>
      <button className="btn primary" onClick={signIn}>Sign in with Google</button>
    </main>
  );
}

