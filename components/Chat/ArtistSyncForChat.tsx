"use client";

import { useEffect, useRef } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";

interface StoredArtistData {
  account_id: string;
  name: string;
}

const STORAGE_KEY = "RECOUP_ARTIST";

const ArtistSyncForChat = () => {
  const { selectedArtist, setSelectedArtist, artists, getArtists } = useArtistProvider();
  const isInitialized = useRef(false);
  const hasRequestedArtists = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    
    const restoreArtistState = async () => {
      if (artists.length === 0 && !hasRequestedArtists.current) {
        hasRequestedArtists.current = true;
        await getArtists();
        return;
      }

      if (!selectedArtist && artists.length > 0) {
        const storedArtistJson = localStorage.getItem(STORAGE_KEY);
        if (!storedArtistJson) return;

        try {
          const storedArtist = JSON.parse(storedArtistJson) as StoredArtistData;
          const matchingArtist = artists.find(
            (artist): artist is ArtistRecord => 
              artist?.account_id === storedArtist.account_id
          );
          
          if (matchingArtist) {
            setSelectedArtist(matchingArtist);
          }
        } catch (error) {
          console.error("Failed to restore artist from storage:", error);
        }
      }
      
      isInitialized.current = true;
    };

    restoreArtistState();
  }, [artists, selectedArtist, setSelectedArtist, getArtists]);

  return null;
};

export default ArtistSyncForChat; 