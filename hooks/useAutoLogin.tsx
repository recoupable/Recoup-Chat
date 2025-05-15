"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function useAutoLogin() {
  const { login } = usePrivy();
  const { email } = useUserProvider();
  const { context } = useMiniKit();

  const hasTriedLogin = useRef(false);

  useEffect(() => {
    const shouldTryLogin = !email && !hasTriedLogin.current && !context;
    if (shouldTryLogin) {
      hasTriedLogin.current = true;
      login();
    }
  }, [email, login, context]);
}

export default useAutoLogin;
