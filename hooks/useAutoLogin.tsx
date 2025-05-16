"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { sdk } from "@farcaster/frame-sdk";

export function useAutoLogin() {
  const { login } = usePrivy();
  const { email } = useUserProvider();

  const hasTriedLogin = useRef(false);

  useEffect(() => {
    const init = async () => {
      hasTriedLogin.current = true;
      const isMiniApp = await sdk.isInMiniApp();
      if (isMiniApp) return;
      login();
    };
    const shouldTryLogin = !email && !hasTriedLogin.current;
    if (!shouldTryLogin) return;
    init();
  }, [email, login]);
}

export default useAutoLogin;
