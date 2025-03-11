"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { createClient } from '@supabase/supabase-js';

/**
 * This component ensures that the selected artist matches the artist_id of the current chat room.
 * It prevents automatic artist switching when navigating to a chat page,
 * but allows manual artist switching by the user.
 */
const ArtistSyncForChat = () => {
  const { chat_id } = useParams();
  const { selectedArtist, setSelectedArtist, artists, getArtists } = useArtistProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSyncedArtistId, setLastSyncedArtistId] = useState<string | null>(null);
  const manualSwitchRef = useRef<boolean>(false);
  const initialSyncDoneRef = useRef<boolean>(false);
  const previousArtistIdRef = useRef<string | null>(null);

  console.log("==== ArtistSyncForChat MOUNTED ====");
  console.log("Current chat_id:", chat_id);
  console.log("Current selectedArtist:", selectedArtist?.name, selectedArtist?.account_id);
  console.log("Available artists:", artists.map(a => ({ name: a.name, id: a.account_id })));

  // These environment variables are publicly accessible in the browser
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  // Fallback to hardcoded values if environment variables are unavailable
  const finalUrl = supabaseUrl || 'https://pmxxzslzlnqttcnwsrsc.supabase.co';
  const supabase = createClient(finalUrl, supabaseAnonKey);

  // Track artist changes to detect manual switches
  useEffect(() => {
    if (!selectedArtist || !previousArtistIdRef.current) {
      previousArtistIdRef.current = selectedArtist?.account_id || null;
      return;
    }

    // If artist changed and it wasn't due to our sync process
    if (selectedArtist.account_id !== previousArtistIdRef.current && initialSyncDoneRef.current) {
      console.log("Manual artist switch detected:", selectedArtist.name);
      manualSwitchRef.current = true;
      
      // Update the room artist data in localStorage to reflect manual switch
      try {
        const roomArtistData = {
          roomId: chat_id,
          artistId: selectedArtist.account_id
        };
        localStorage.setItem("RECOUP_ROOM_ARTIST", JSON.stringify(roomArtistData));
        console.log("Updated room artist data after manual switch:", roomArtistData);
        
        // Update lastSyncedArtistId to prevent further syncing
        setLastSyncedArtistId(selectedArtist.account_id);
        
        // Update the room's artist_id in the database
        updateRoomArtistId(chat_id as string, selectedArtist.account_id);
      } catch (e) {
        console.error("Failed to update room artist data after manual switch:", e);
      }
    }
    
    previousArtistIdRef.current = selectedArtist.account_id;
  }, [selectedArtist?.account_id, chat_id]);

  // Function to update the room's artist_id in the database
  const updateRoomArtistId = async (roomId: string, artistId: string) => {
    try {
      console.log("Updating room artist_id in database:", { roomId, artistId });
      const { error } = await supabase
        .from("rooms")
        .update({ artist_id: artistId })
        .eq("id", roomId);
        
      if (error) {
        console.error("Error updating room artist_id:", error);
      } else {
        console.log("Room artist_id updated successfully");
      }
    } catch (e) {
      console.error("Failed to update room artist_id:", e);
    }
  };

  // Function to validate and clean up stored artist data
  const validateStoredArtistData = () => {
    try {
      // Check localStorage for stored artist
      const storedArtist = localStorage.getItem("RECOUP_ARTIST");
      if (storedArtist) {
        const artistData = JSON.parse(storedArtist);
        
        // Check if this artist exists in our current artists list
        const artistExists = artists.some(
          (artist) => artist.account_id === artistData.account_id
        );
        
        // If the artist doesn't exist in our current list, remove it from localStorage
        if (!artistExists) {
          console.log("Stored artist no longer exists in artists list, removing from localStorage:", artistData.name);
          localStorage.removeItem("RECOUP_ARTIST");
          
          // If this was the selected artist, clear it
          if (selectedArtist && selectedArtist.account_id === artistData.account_id) {
            console.log("Clearing selected artist as it no longer exists");
            setSelectedArtist(null);
          }
        }
      }
      
      // Check localStorage for room artist data
      const storedRoomArtist = localStorage.getItem("RECOUP_ROOM_ARTIST");
      if (storedRoomArtist) {
        const roomArtistData = JSON.parse(storedRoomArtist);
        
        // Check if this artist exists in our current artists list
        const artistExists = artists.some(
          (artist) => artist.account_id === roomArtistData.artistId
        );
        
        // If the artist doesn't exist in our current list, remove it from localStorage
        if (!artistExists) {
          console.log("Stored room artist no longer exists in artists list, removing from localStorage");
          localStorage.removeItem("RECOUP_ROOM_ARTIST");
        }
      }
    } catch (e) {
      console.error("Error validating stored artist data:", e);
    }
  };

  // Add this effect to validate stored artist data when artists are loaded
  useEffect(() => {
    if (artists.length > 0) {
      validateStoredArtistData();
    }
  }, [artists]);

  // First effect: Make sure artists are loaded
  useEffect(() => {
    if (artists.length === 0) {
      console.log("No artists available, fetching artists data...");
      getArtists();
    }
  }, [artists.length, getArtists]);

  // Second effect: Check localStorage for room artist data
  useEffect(() => {
    if (!chat_id || !artists.length) return;
    
    // Skip if a manual switch has occurred
    if (manualSwitchRef.current) {
      console.log("Manual switch detected, skipping localStorage check");
      return;
    }
    
    try {
      const storedRoomArtist = localStorage.getItem("RECOUP_ROOM_ARTIST");
      if (storedRoomArtist) {
        const roomArtistData = JSON.parse(storedRoomArtist);
        console.log("Found stored room artist data:", roomArtistData);
        
        // Check if this is the same room
        if (roomArtistData.roomId === chat_id) {
          console.log("Room ID matches current chat_id");
          
          // Find the matching artist
          const matchingArtist = artists.find(
            (artist) => artist.account_id === roomArtistData.artistId
          );
          
          if (matchingArtist && (!selectedArtist || selectedArtist.account_id !== matchingArtist.account_id)) {
            console.log(`Setting artist from localStorage: ${matchingArtist.name}`);
            setSelectedArtist(matchingArtist);
            setLastSyncedArtistId(matchingArtist.account_id);
            initialSyncDoneRef.current = true;
            return;
          }
        }
      }
    } catch (e) {
      console.error("Error checking localStorage for room artist data:", e);
    }
  }, [chat_id, artists, selectedArtist, setSelectedArtist]);

  // Third effect: Sync artist with room from Supabase
  useEffect(() => {
    console.log("==== ArtistSyncForChat EFFECT TRIGGERED ====");
    console.log("Effect params - chat_id:", chat_id, "selectedArtist:", selectedArtist?.account_id);
    console.log("Retry count:", retryCount);
    console.log("Manual switch flag:", manualSwitchRef.current);
    console.log("Initial sync done:", initialSyncDoneRef.current);
    
    // Skip if we've already synced this artist, if we're still loading, or if a manual switch occurred
    if (lastSyncedArtistId === selectedArtist?.account_id || manualSwitchRef.current || initialSyncDoneRef.current) {
      console.log("Already synced this artist, manual switch occurred, or initial sync done - skipping");
      return;
    }
    
    const syncArtistWithRoom = async () => {
      if (!chat_id || isLoading || !artists.length) {
        console.log("Sync skipped - Missing required data:", { 
          chat_id: !!chat_id, 
          isLoading, 
          hasArtists: artists.length > 0 
        });
        return;
      }
      
      console.log("Starting artist sync for chat:", chat_id);
      setIsLoading(true);
      
      try {
        console.log("Fetching room data from Supabase...");
        // Fetch the room to get its artist_id
        const { data: room, error } = await supabase
          .from("rooms")
          .select("artist_id, topic")
          .eq("id", chat_id)
          .single();
          
        if (error) {
          console.error("Error fetching room for artist sync:", error);
          
          // If we haven't retried too many times, schedule a retry
          if (retryCount < 3) {
            console.log(`Scheduling retry ${retryCount + 1}/3 in 1 second...`);
            setTimeout(() => {
              setRetryCount(retryCount + 1);
            }, 1000);
          } else {
            console.log("Max retries reached, giving up on artist sync");
            initialSyncDoneRef.current = true;
          }
          
          setIsLoading(false);
          return;
        }
        
        console.log("Room data received:", room);
        
        if (room?.artist_id) {
          console.log("Room has artist_id:", room.artist_id);
          console.log("Current selectedArtist:", selectedArtist?.account_id);
          
          // Store that we've synced this artist
          setLastSyncedArtistId(room.artist_id);
          
          // Store the room artist data in localStorage
          try {
            const roomArtistData = {
              roomId: chat_id,
              artistId: room.artist_id
            };
            localStorage.setItem("RECOUP_ROOM_ARTIST", JSON.stringify(roomArtistData));
            console.log("Saved room artist data to localStorage:", roomArtistData);
          } catch (e) {
            console.error("Failed to save room artist data to localStorage:", e);
          }
          
          // If the room has an artist_id and it's different from the currently selected artist
          if (!selectedArtist || selectedArtist.account_id !== room.artist_id) {
            console.log("Artist mismatch detected, finding matching artist...");
            // Find the artist in the list that matches the room's artist_id
            const matchingArtist = artists.find(
              (artist) => artist.account_id === room.artist_id
            );
            
            // If found, set it as the selected artist
            if (matchingArtist) {
              console.log(`Syncing artist selection to match chat - FROM: ${selectedArtist?.name} TO: ${matchingArtist.name}`);
              
              // Use localStorage as a backup to ensure persistence
              try {
                localStorage.setItem("RECOUP_ARTIST", JSON.stringify(matchingArtist));
                console.log("Saved artist to localStorage as backup");
              } catch (e) {
                console.error("Failed to save artist to localStorage:", e);
              }
              
              setSelectedArtist(matchingArtist);
            } else {
              console.log("No matching artist found in available artists list");
            }
          } else {
            console.log("Artist already matches chat room, no change needed");
          }
        } else {
          console.log("Room has no artist_id, keeping current selection");
        }
        
        // Mark initial sync as done
        initialSyncDoneRef.current = true;
      } catch (error) {
        console.error("Error in syncArtistWithRoom:", error);
        initialSyncDoneRef.current = true;
      } finally {
        setIsLoading(false);
        console.log("Artist sync process completed");
      }
    };

    syncArtistWithRoom();
  }, [chat_id, selectedArtist?.account_id, artists, setSelectedArtist, isLoading, retryCount, lastSyncedArtistId]);

  // This is a utility component that doesn't render anything
  return null;
};

export default ArtistSyncForChat; 