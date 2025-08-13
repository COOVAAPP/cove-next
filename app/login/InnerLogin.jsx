"use client";

import { useSearchParams } from "next/navigation";

export default function InnerLogin() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div>
      <h1>Login</h1>
      <p>Redirect after login: {redirect}</p>
    </div>
  );
}