"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginComponent() {
  const search = useSearchParams();
  const router = useRouter();
  const next = search.get("redirect") || "/list";

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: 16 }}>
      <h1>Login</h1>
      <button onClick={signIn} className="btn">
        Sign in with Google
      </button>
    </main>
  );
}