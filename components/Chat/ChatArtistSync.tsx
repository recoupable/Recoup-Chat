"use client";

import { useEffect } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";

interface ChatArtistSyncProps {
  artistId?: string;
}

/**
 * Syncs the selected artist with the room's artist_id
 */
const ChatArtistSync = ({ artistId }: ChatArtistSyncProps) => {
  const { artists, setSelectedArtist, selectedArtist } = useArtistProvider();

  useEffect(() => {
    console.log("🔍 CHAT ARTIST SYNC COMPONENT MOUNTED");
    console.log("🎨 ARTIST SYNC DATA:", {
      artistId,
      artistsCount: artists.length,
      artistsLoaded: artists.length > 0,
      currentSelectedArtist: selectedArtist?.name,
      currentSelectedArtistId: selectedArtist?.account_id,
      allArtistIds: artists.map(a => a.account_id)
    });

    if (!artistId || artists.length === 0) {
      console.log("⚠️ Cannot sync artist: missing artistId or artists not loaded");
      return;
    }
    
    const matchingArtist = artists.find(artist => artist.account_id === artistId);
    
    if (!matchingArtist) {
      console.log("❌ Artist not found for ID:", artistId);
      return;
    }
    
    const isAlreadySelected = selectedArtist?.account_id === matchingArtist.account_id;
    
    if (isAlreadySelected) {
      console.log("✅ Artist already selected:", matchingArtist.name);
      return;
    }
    
    console.log("🔄 Syncing artist selection to:", matchingArtist.name);
    setSelectedArtist(matchingArtist);
  }, [artistId, artists, setSelectedArtist, selectedArtist]);

  return null;
};

export default ChatArtistSync; 