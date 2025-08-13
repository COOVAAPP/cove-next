"use client";

import LoginComponent from "./LoginComponent";

export default function Page({ searchParams }) {
  // Force default to /list (never /dashboard)
  const redirect =
    typeof searchParams?.redirect === "string" && searchParams.redirect
      ? searchParams.redirect
      : "/list";

  return <LoginComponent redirect={redirect} />;
}

