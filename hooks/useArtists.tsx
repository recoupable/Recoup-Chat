import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";
import { useCallback, useEffect, useState } from "react";

const useArtists = () => {
  const { email } = useUserProvider();
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(
    null,
  );
  const [artistActive, setArtistActive] = useState(false);

  const getArtists = useCallback(async () => {
    if (!email) return;
    const response = await fetch(
      `/api/artists?email=${encodeURIComponent(email as string)}`,
    );
    const data = await response.json();
    setArtists(data.artists);
  }, [email]);

  useEffect(() => {
    if (selectedArtist && artists.length > 0) {
      const currentArtist = artists.filter(
        (artist: ArtistRecord) => artist.id === selectedArtist.id,
      );
      if (currentArtist?.length) {
        setSelectedArtist(currentArtist[0]);
      }
    }
  }, [artists, selectedArtist]);

  useEffect(() => {
    getArtists();
  }, [getArtists]);

  return {
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist,
    artistActive,
    setArtistActive,
    getArtists,
  };
};

export default useArtists;
