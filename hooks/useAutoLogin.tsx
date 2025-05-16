"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/frame-sdk";

export function useAutoLogin() {
  const { login } = usePrivy();
  const { email } = useUserProvider();
  const { context, isFrameReady } = useMiniKit();

  const hasTriedLogin = useRef(false);

  useEffect(() => {
    const init = async () => {
      console.log("useAutoLogin calling login");

      hasTriedLogin.current = true;
      const isMiniApp = await sdk.isInMiniApp();
      if (isMiniApp) return;
      login();
    };
    const shouldTryLogin = !email && !hasTriedLogin.current;
    console.log("useAutoLogin context", context);
    console.log("useAutoLogin isFrameReady", isFrameReady);
    console.log("useAutoLogin isMiniApp", shouldTryLogin);
    if (!shouldTryLogin) return;
    init();
  }, [email, login, context, isFrameReady]);
}

export default useAutoLogin;
