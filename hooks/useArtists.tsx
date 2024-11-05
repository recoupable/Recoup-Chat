import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";
import { useEffect, useState } from "react";

const useArtists = () => {
  const { email } = useUserProvider();
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(
    null,
  );
  const [artistActive, setArtistActive] = useState(false);

  useEffect(() => {
    const init = async () => {
      const response = await fetch(
        `/api/artists?email=${encodeURIComponent(email as string)}`,
      );
      const data = await response.json();
      setArtists(data.artists);
    };
    if (!email) return;
    init();
  }, [email]);

  return {
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist,
    artistActive,
    setArtistActive,
  };
};

export default useArtists;
