"use client";

import { useEffect, useRef } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";

interface StoredArtist {
  account_id: string;
  name: string;
}

/**
 * This component ensures that the selected artist matches the artist_id of the current chat room.
 * It prevents automatic artist switching when navigating to a chat page,
 * but allows manual artist switching by the user.
 */
const ArtistSyncForChat = () => {
  const { selectedArtist, setSelectedArtist, artists, getArtists } = useArtistProvider();
  const hasInitialized = useRef(false);
  const artistsFetched = useRef(false);

  // Single effect to handle artist restoration and fetching
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const initializeArtists = async () => {
      // Only fetch artists once
      if (artists.length === 0 && !artistsFetched.current) {
        artistsFetched.current = true;
        await getArtists();
        return;
      }

      // Only try to restore if we don't have a selected artist
      if (!selectedArtist && artists.length > 0) {
        const storedArtist = localStorage.getItem("RECOUP_ARTIST");
        if (storedArtist) {
          try {
            const artistData = JSON.parse(storedArtist) as StoredArtist;
            const matchingArtist = artists.find(
              (artist): artist is ArtistRecord => 
                artist?.account_id === artistData.account_id
            );
            if (matchingArtist) {
              setSelectedArtist(matchingArtist);
            }
          } catch (e) {
            console.error("Error restoring artist:", e);
          }
        }
      }
      
      hasInitialized.current = true;
    };

    initializeArtists();
  }, [artists, selectedArtist, setSelectedArtist, getArtists]);

  return null;
};

export default ArtistSyncForChat; 