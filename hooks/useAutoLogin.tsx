"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function useAutoLogin() {
  const { login } = usePrivy();
  const { email } = useUserProvider();
  const { isFrameReady } = useMiniKit();

  const hasTriedLogin = useRef(false);

  useEffect(() => {
    const shouldTryLogin = !email && !hasTriedLogin.current && !isFrameReady;
    if (!shouldTryLogin) return;
    hasTriedLogin.current = true;
    login();
  }, [email, login, isFrameReady]);
}

export default useAutoLogin;
