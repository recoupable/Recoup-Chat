"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { useMiniAppContext } from "@/providers/MiniAppProvider";

export function useAutoLogin() {
  const { login } = usePrivy();
  const { email } = useUserProvider();
  const { isMiniApp } = useMiniAppContext();
  const hasTriedLogin = useRef(false);

  useEffect(() => {
    const shouldTryLogin = !email && !hasTriedLogin.current && !isMiniApp;
    if (!shouldTryLogin) return;
    hasTriedLogin.current = true;
    login();
  }, [email, login, isMiniApp]);
}

export default useAutoLogin;
