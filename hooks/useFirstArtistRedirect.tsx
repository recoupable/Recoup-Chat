"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useUserProvider } from "@/providers/UserProvder";
import { useMiniAppContext } from "@/providers/MiniAppProvider";

export function useFirstArtistRedirect() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { userData } = useUserProvider();
  const { isMiniApp } = useMiniAppContext();

  useEffect(() => {
    async function checkAndRedirect() {
      const isPrivyReady = ready && authenticated;
      const isAuthenticated = isPrivyReady || isMiniApp;
      const isUserReady = userData.id;
      if (!isAuthenticated || !isUserReady) return;

      try {
        const response = await fetch(
          `/api/artists?accountId=${encodeURIComponent(userData.id)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch artists");
        }

        if (!data.artists || data.artists.length === 0) {
          router.push("/funnels/wrapped");
        }
      } catch (error) {
        console.error("Error checking artists:", error);
      }
    }

    checkAndRedirect();
  }, [ready, authenticated, userData.id, router, isMiniApp]);
}
