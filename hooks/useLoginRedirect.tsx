"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";

export function useLoginRedirect() {
  const { login } = usePrivy();
  const { email } = useUserProvider();
  const hasTriedLogin = useRef(false);

  useEffect(() => {
    if (!email && !hasTriedLogin.current) {
      hasTriedLogin.current = true;
      login();
    }
  }, [email, login]);

  return { isLoggedIn: !!email };
}

export default useLoginRedirect; 