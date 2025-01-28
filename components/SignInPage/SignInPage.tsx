"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (authenticated) {
      router.push("/");
      return;
    }

    // Show login modal on page load
    login();
  }, [authenticated]);

  // Return an empty div as per requirements
  return <div />;
}
