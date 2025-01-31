"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

/**
 * Hook to redirect to /funnels/wrapped when user has no artists
 */
export function useFirstArtistRedirect() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    async function checkAndRedirect() {
      if (!ready || !authenticated || !user?.email?.address) return;

      try {
        const response = await fetch(
          `/api/artists?email=${encodeURIComponent(user.email.address)}`
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
  }, [ready, authenticated, user?.email?.address, router]);
}
