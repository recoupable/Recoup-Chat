import { ARTIST_INFO } from "@/types/Artist";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const useInitialArtists = (
  artists: ARTIST_INFO[],
  selectedArtist: ARTIST_INFO | null,
  setSelectedArtist: Dispatch<SetStateAction<ARTIST_INFO | null>>,
) => {
  const [artistCookie, setArtistCookie] = useLocalStorage("RECOUP_ARTIST", {});

  useEffect(() => {
    if (selectedArtist) {
      setArtistCookie(selectedArtist);
    }
  }, [selectedArtist]);

  useEffect(() => {
    if (Object.keys(artistCookie).length > 0) {
      setSelectedArtist(artistCookie as any);
    }
  }, []);

  useEffect(() => {
    if (selectedArtist && artists.length > 0) {
      const currentArtist = artists.find(
        (artist: ARTIST_INFO) => artist.artist_id === selectedArtist.artist_id,
      );
      if (currentArtist && !selectedArtist?.isWrapped)
        setSelectedArtist(currentArtist);
    }
  }, [artists, selectedArtist]);

  const handleSelectArtist = (artist: ARTIST_INFO | null) => {
    setSelectedArtist(artist);
    if (artist) setArtistCookie(artist);
  };

  return {
    handleSelectArtist,
  };
};

export default useInitialArtists;
