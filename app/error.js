"use client";

export default function Error({ error, reset }) {
  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: 24 }}>
      <h1>Something went wrong</h1>
      <p style={{ marginTop: 8, color: "#666" }}>{String(error?.message || "Unknown error")}</p>
      <button onClick={() => reset()} style={{ marginTop: 16, padding: "8px 12px" }}>
        Try again
      </button>
    </main>
  );
}