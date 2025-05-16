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
    const init = async () => {
      console.log("useAutoLogin calling login");

      hasTriedLogin.current = true;
      if (context) return;
      login();
    };
    const shouldTryLogin =
      !email && !hasTriedLogin.current && !context && isFrameReady;
    if (!shouldTryLogin) return;
    init();
  }, [email, login, context, isFrameReady]);
}

export default useAutoLogin;
