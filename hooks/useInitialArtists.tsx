import { ArtistRecord } from "@/types/Artist";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import useArtistSetting from "./useArtistSetting";

const useInitialArtists = (
  artists: ArtistRecord[],
  selectedArtist: ArtistRecord | null,
  artistSetting: ReturnType<typeof useArtistSetting>,
  setSelectedArtist: Dispatch<SetStateAction<ArtistRecord | null>>,
) => {
  const [artistCookie, setArtistCookie] = useLocalStorage("RECOUP_ARTIST", {});

  useEffect(() => {
    if (selectedArtist) {
      artistSetting.setName(selectedArtist?.name || "");
      artistSetting.setImage(selectedArtist?.image || "");
      artistSetting.setLabel(selectedArtist?.label || "");
      artistSetting.setInstruction(selectedArtist?.instruction || "");
      artistSetting.setBases(selectedArtist?.knowledges || "");
      const socialMediaTypes = {
        TWITTER: artistSetting.setTwitter,
        YOUTUBE: artistSetting.setYoutube,
        APPLE: artistSetting.setAppleUrl,
        INSTAGRAM: artistSetting.setInstagram,
        SPOTIFY: artistSetting.setSpotifyUrl,
        TIKTOK: artistSetting.setTikTok,
      };
      Object.entries(socialMediaTypes).forEach(([type, setter]) => {
        const link = selectedArtist?.artist_social_links?.find(
          (item) => item.type === type,
        )?.link;
        setter(link || "");
      });
    }
  }, [selectedArtist]);

  useEffect(() => {
    if (Object.keys(artistCookie).length > 0) {
      setSelectedArtist(artistCookie as any);
    }
  }, [artistCookie]);

  useEffect(() => {
    if (selectedArtist && artists.length > 0) {
      const currentArtist = artists.find(
        (artist: ArtistRecord) => artist.id === selectedArtist.id,
      );
      if (currentArtist && !selectedArtist?.isWrapped) {
        setSelectedArtist(currentArtist);
      }
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
