import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirect = url.searchParams.get("redirect") || "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(new URL("/login?error=oauth", req.url));
  }

  return NextResponse.redirect(new URL(redirect, req.url));
}


