"use client";

import { useEffect } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { usePathname } from "next/navigation";

/**
 * This component ensures that the artist selection is persisted when navigating between pages.
 * It stores the selected artist in localStorage and restores it when needed.
 */
const PersistArtistSelection = () => {
  const { selectedArtist, setSelectedArtist, artists } = useArtistProvider();
  const pathname = usePathname();

  // Log component mounting
  console.log("==== PersistArtistSelection MOUNTED ====");
  console.log("Current pathname:", pathname);
  console.log("Current selectedArtist:", selectedArtist?.name, selectedArtist?.account_id);
  console.log("Available artists:", artists.length);

  // Effect to restore artist selection from localStorage
  useEffect(() => {
    // Only run if we don't have a selected artist but we do have artists available
    if (!selectedArtist && artists.length > 0) {
      try {
        console.log("No artist selected, checking localStorage...");
        const storedArtist = localStorage.getItem("RECOUP_ARTIST");
        
        if (storedArtist) {
          const parsedArtist = JSON.parse(storedArtist);
          console.log("Found stored artist:", parsedArtist.name, parsedArtist.account_id);
          
          // Find the matching artist in our current artists list
          const matchingArtist = artists.find(
            (artist) => artist.account_id === parsedArtist.account_id
          );
          
          if (matchingArtist) {
            console.log("Setting artist from localStorage:", matchingArtist.name);
            setSelectedArtist(matchingArtist);
          } else {
            console.log("Stored artist not found in current artists list");
          }
        } else {
          console.log("No artist found in localStorage");
        }
      } catch (error) {
        console.error("Error restoring artist from localStorage:", error);
      }
    }
  }, [selectedArtist, artists, setSelectedArtist]);

  // Effect to save artist selection to localStorage
  useEffect(() => {
    if (selectedArtist) {
      console.log("Saving artist to localStorage:", selectedArtist.name);
      localStorage.setItem("RECOUP_ARTIST", JSON.stringify(selectedArtist));
    }
  }, [selectedArtist]);

  // This is a utility component that doesn't render anything
  return null;
};

export default PersistArtistSelection; 