"use client";

import { Suspense } from "react";
import InnerLogin from "./InnerLogin";

export default function LoginComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerLogin />
    </Suspense>
  );
}
    });
    if (error) {
      console.error(error);
      alert("Google sign-in failed.");
      return;
    }
    // Supabase will redirect to Google; nothing else needed here.
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <h1>Login</h1>
      <button
        onClick={onGoogle}
        style={{
          marginTop: 12,
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Sign in with Google
      </button>
    </main>
  );
}