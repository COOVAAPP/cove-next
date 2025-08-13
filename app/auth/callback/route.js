import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "/dashboard";
  return NextResponse.redirect(new URL(redirect, req.url));
}

