"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";

export default function SignInPage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/");
      return;
    }

    login();
  }, [authenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading className="w-8 h-8" />
    </div>
  );
}
