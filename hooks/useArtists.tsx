import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";
import { useCallback, useEffect, useState } from "react";
import useArtistSetting from "./useArtistSetting";
import { SETTING_MODE } from "@/types/Setting";

const useArtists = () => {
  const artistSetting = useArtistSetting();
  const { email } = useUserProvider();
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(
    null,
  );
  const [artistActive, setArtistActive] = useState(false);
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settingMode, setSettingMode] = useState(SETTING_MODE.UPDATE);
  const loading = artistSetting.imageUploading || updating;

  const toggleCreation = () => {
    artistSetting.clearParams();
    setSettingMode(SETTING_MODE.CREATE);
    toggleSettingModal();
  };

  const toggleUpdate = (artist: ArtistRecord) => {
    setSettingMode(SETTING_MODE.UPDATE);
    setSelectedArtist(artist);
    setArtistActive(true);
  };

  const toggleSettingModal = () => {
    setIsOpenSettingModal(!isOpenSettingModal);
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

  const saveSetting = async () => {
    setUpdating(true);
    const response = await fetch("/api/artist/profile", {
      method: "POST",
      body: JSON.stringify({
        name: artistSetting.name,
        image: artistSetting.image,
        artistId: settingMode === SETTING_MODE.CREATE ? "" : selectedArtist?.id,
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
    return data?.artistInfo;
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
      artistSetting.setName(selectedArtist.name || "");
      artistSetting.setImage(selectedArtist.image || "");
    }
  }, [selectedArtist]);

  return {
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist,
    artistActive,
    setArtistActive,
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
