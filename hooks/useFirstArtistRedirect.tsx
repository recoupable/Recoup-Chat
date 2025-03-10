"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useArtistProvider } from "@/providers/ArtistProvider";

export function useFirstArtistRedirect() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { selectedArtist, artists, setSelectedArtist } = useArtistProvider();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAndRedirect() {
      if (!ready || !authenticated || !user?.email?.address) return;

      try {
        // If we already have a selected artist, don't change it
        if (selectedArtist) {
          console.log("Artist already selected:", selectedArtist.name);
          
          // If we're on the root path, redirect to /new
          if (pathname === "/") {
            router.push("/new");
          }
          
          return;
        }

        // Only fetch artists if we don't have any loaded yet
        if (artists.length === 0) {
          console.log("Fetching artists for the first time");
          const response = await fetch(
            `/api/artists?email=${encodeURIComponent(user.email.address)}`,
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch artists");
          }

          if (!data.artists || data.artists.length === 0) {
            router.push("/funnels/wrapped");
          } else if (pathname === "/") {
            // Only redirect from the root path to /new
            router.push("/new");
          }
        } else if (!selectedArtist && artists.length > 0) {
          // Only set the first artist if no artist is currently selected
          console.log("Setting first artist as selected:", artists[0].name);
          setSelectedArtist(artists[0]);
          
          // If we're on the root path, redirect to /new
          if (pathname === "/") {
            router.push("/new");
          }
        }
      } catch (error) {
        console.error("Error checking artists:", error);
      }
    }

    checkAndRedirect();
  }, [ready, authenticated, user?.email?.address, router, selectedArtist, artists, setSelectedArtist, pathname]);
}
