import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";
import { useCallback, useEffect, useState } from "react";
import useArtistSetting from "./useArtistSetting";
import { SETTING_MODE } from "@/types/Setting";
import { useLocalStorage } from "usehooks-ts";

const useArtists = () => {
  const artistSetting = useArtistSetting();
  const { email } = useUserProvider();
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(
    null,
  );
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settingMode, setSettingMode] = useState(SETTING_MODE.UPDATE);
  const loading = artistSetting.imageUploading || updating;
  const [artistCookie, setArtistCookie] = useLocalStorage("RECOUP_ARTIST", {});

  const toggleCreation = () => {
    artistSetting.clearParams();
    setSettingMode(SETTING_MODE.CREATE);
    toggleSettingModal();
  };

  const toggleUpdate = (artist: ArtistRecord) => {
    setSettingMode(SETTING_MODE.UPDATE);
    setSelectedArtist(artist);
  };

  const toggleSettingModal = () => {
    setIsOpenSettingModal(!isOpenSettingModal);
  };

  const handleSelectArtist = (artist: ArtistRecord | null) => {
    setSelectedArtist(artist);
    if (artist) setArtistCookie(artist);
  };

  const getArtists = useCallback(async () => {
    if (!email) return;
    const response = await fetch(
      `/api/artists?email=${encodeURIComponent(email as string)}`,
    );
    const data = await response.json();
    setArtists(data.artists);
    if (selectedArtist) {
      const newUpdatedInfo = data.artists.filter(
        (artist: ArtistRecord) => artist.id === selectedArtist.id,
      );
      setSelectedArtist(newUpdatedInfo?.[0] || selectedArtist);
    }
  }, [email]);

  const saveSetting = async (
    name?: string,
    image?: string,
    tiktokUrl?: string,
    mode?: string,
  ) => {
    setUpdating(true);
    const saveMode = mode || settingMode;

    try {
      const response = await fetch("/api/artist/profile", {
        method: "POST",
        body: JSON.stringify({
          name: name || artistSetting.name,
          image: image || artistSetting.image,
          tiktok_url: tiktokUrl || artistSetting.tiktok,
          youtube_url: artistSetting.youtube,
          apple_url: artistSetting.appleUrl,
          instagram_url: artistSetting.instagram,
          twitter_url: artistSetting.twitter,
          spotify_url: artistSetting.spotifyUrl,
          instruction: artistSetting.instruction,
          label: artistSetting.label,
          knowledges: artistSetting.bases,
          artistId: saveMode === SETTING_MODE.CREATE ? "" : selectedArtist?.id,
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      await getArtists();
      setUpdating(false);
      if (settingMode === SETTING_MODE.CREATE)
        setSettingMode(SETTING_MODE.UPDATE);
      return data.artistInfo;
    } catch (error) {
      console.error(error);
      setUpdating(false);
      return null;
    }
  };

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

  return {
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist: handleSelectArtist,
    getArtists,
    isOpenSettingModal,
    setIsOpenSettingModal,
    toggleSettingModal,
    updating,
    loading,
    saveSetting,
    setSettingMode,
    settingMode,
    toggleCreation,
    toggleUpdate,
    ...artistSetting,
  };
};

export default useArtists;
