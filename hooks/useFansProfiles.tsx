import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useCallback, useEffect, useState } from "react";

const useFansProfiles = () => {
  const [fansProfiles, setFansProfiles] = useState<any>([]);
  const { selectedArtist } = useArtistProvider();
  const { email } = useUserProvider();

  const getFansProfiles = useCallback(async () => {
    if (!selectedArtist?.artist_id) {
      setFansProfiles([]);
      return;
    }
    const response = await fetch(
      `/api/get_fans_profiles?artistId=${selectedArtist?.artist_id}`,
    );
    const data = await response.json();
    setFansProfiles(data.data || []);
  }, [selectedArtist, email]);

  useEffect(() => {
    const timer = setInterval(getFansProfiles, 5000);
    return () => clearInterval(timer);
  }, [getFansProfiles]);

  return {
    fansProfiles,
  };
};

export default useFansProfiles;
