import { ArtistRecord } from "@/types/Artist";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const useInitialArtists = (
  artists: ArtistRecord[],
  selectedArtist: ArtistRecord | null,
  setSelectedArtist: Dispatch<SetStateAction<ArtistRecord | null>>,
) => {
  const [artistCookie, setArtistCookie] = useLocalStorage<Partial<ArtistRecord>>("RECOUP_ARTIST", {});

  useEffect(() => {
    if (selectedArtist) {
      setArtistCookie(selectedArtist);
    }
  }, [selectedArtist]);

  useEffect(() => {
    if (Object.keys(artistCookie).length > 0 && artists.length > 0) {
      // Validate that the artist in localStorage exists in the current artists list
      const artistExists = artists.some(
        (artist: ArtistRecord) => artist.account_id === artistCookie.account_id
      );
      
      if (artistExists) {
        // Only set the selected artist if it exists in the current list
        setSelectedArtist(artistCookie as ArtistRecord);
      } else {
        // If the artist doesn't exist, clear it from localStorage
        console.log("Artist in localStorage no longer exists in artists list, clearing");
        setArtistCookie({});
        
        // If there are artists available, select the first one
        if (artists.length > 0) {
          console.log("Setting first available artist as selected");
          setSelectedArtist(artists[0]);
        }
      }
    } else if (artists.length > 0 && !selectedArtist) {
      // If no artist is selected but we have artists, select the first one
      console.log("No artist selected, setting first available artist");
      setSelectedArtist(artists[0]);
    }
  }, [artists]);

  useEffect(() => {
    if (selectedArtist && artists.length > 0) {
      const currentArtist = artists.find(
        (artist: ArtistRecord) =>
          artist.account_id === selectedArtist.account_id,
      );
      if (currentArtist && !selectedArtist?.isWrapped)
        setSelectedArtist(currentArtist);
    }
  }, [artists, selectedArtist]);

  const handleSelectArtist = (artist: ArtistRecord | null) => {
    setSelectedArtist(artist);
    if (artist) setArtistCookie(artist);
  };

  return {
    handleSelectArtist,
  };
};

export default useInitialArtists;
