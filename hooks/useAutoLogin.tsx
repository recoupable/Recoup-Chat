"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function useAutoLogin() {
  const { login } = usePrivy();
  const { email } = useUserProvider();
  const { context, isFrameReady } = useMiniKit();

  const hasTriedLogin = useRef(false);

  useEffect(() => {
    const shouldTryLogin = !email && !hasTriedLogin.current && !isFrameReady;
    console.log("useAutoLogin context", context);
    console.log("useAutoLogin isFrameReady", isFrameReady);
    console.log("useAutoLogin shouldTryLogin", shouldTryLogin);
    if (shouldTryLogin) {
      hasTriedLogin.current = true;
      console.log("useAutoLogin calling login");
      login();
    }
  }, [email, login, context, isFrameReady]);
}

export default useAutoLogin;
