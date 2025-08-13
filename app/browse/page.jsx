"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function BrowsePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price_per_hour, image_url, location")
        .order("inserted_at", { ascending: false })
        .limit(12);

      if (!cancelled) {
        setRows(data || []);
        setLoading(false);
      }

      if (error) {
        console.error("Browse load error:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 16 }}>Latest Listings</h2>

      {rows.length === 0 ? (
        <div>No listings yet.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/listings/${r.id}`}
              style={{
                display: "block",
                border: "1px solid #eee",
                borderRadius: 10,
                overflow: "hidden",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background:
                    `url(${r.image_url || "https://placehold.co/800x600?text=Listing"}) center/cover no-repeat`,
                }}
              />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                  {r.location || "—"}
                </div>
                <div style={{ marginTop: 6, color: "#6b46c1", fontWeight: 700 }}>
                  {typeof r.price_per_hour === "number" ? `$${r.price_per_hour}/hour` : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}