"use client";

import { Suspense } from "react";
import InnerLogin from "./InnerLogin";

export default function LoginComponent() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <Suspense fallback={<div>Loading…</div>}>
        <InnerLogin />
      </Suspense>
    </main>
  );
}