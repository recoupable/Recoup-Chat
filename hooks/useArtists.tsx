import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";
import { useCallback, useEffect, useState } from "react";
import useArtistSetting from "./useArtistSetting";
import { SETTING_MODE } from "@/types/Setting";
import useArtistMode from "./useArtistMode";
import saveArtist from "@/lib/saveArtist";
import useInitialArtists from "./useInitialArtists";
import useCreateArtists from "./useCreateArtists";

// Helper function to sort artists alphabetically by name
const sortArtistsAlphabetically = (artists: ArtistRecord[]): ArtistRecord[] => {
  return [...artists].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });
};

const useArtists = () => {
  const artistSetting = useArtistSetting();
  const [isLoading, setIsLoading] = useState(true);
  const { email } = useUserProvider();
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(
    null,
  );
  const [updating, setUpdating] = useState(false);
  const loading = artistSetting.imageUploading || updating;
  const artistMode = useArtistMode(
    artistSetting.clearParams,
    artistSetting.setEditableArtist,
  );
  const { handleSelectArtist } = useInitialArtists(
    artists,
    selectedArtist,
    setSelectedArtist,
  );
  const [menuVisibleArtistId, setMenuVisibleArtistId] = useState<any>("");
  const activeArtistIndex = artists.findIndex(
    (artist: ArtistRecord) => artist.account_id === selectedArtist?.account_id,
  );
  const { isCreatingArtist, setIsCreatingArtist, updateChatState } = useCreateArtists();

  const sorted =
    selectedArtist && activeArtistIndex >= 0
      ? [
          selectedArtist,
          ...sortArtistsAlphabetically([
            ...artists.slice(0, activeArtistIndex),
            ...artists.slice(activeArtistIndex + 1),
          ]),
        ]
      : sortArtistsAlphabetically(artists);

  const getArtists = useCallback(
    async (artistId?: string) => {
      if (!email) {
        setArtists([]);
        return;
      }
      const response = await fetch(
        `/api/artists?email=${encodeURIComponent(email as string)}`,
      );
      const data = await response.json();
      setArtists(data.artists);
      if (data.artists.length === 0) {
        setSelectedArtist(null);
        setIsLoading(false);
        return;
      }
      if (artistId) {
        const newUpdatedInfo = data.artists.find(
          (artist: ArtistRecord) => artist.account_id === artistId,
        );
        if (newUpdatedInfo) setSelectedArtist(newUpdatedInfo);
      }
      setIsLoading(false);
    },
    [email],
  );
  const saveSetting = async () => {
    setUpdating(true);
    const saveMode = artistMode.settingMode;
    try {
      const profileUrls = {
        TWITTER: artistSetting.twitter,
        TIKTOK: artistSetting.tiktok,
        YOUTUBE: artistSetting.youtube,
        INSTAGRAM: artistSetting.instagram,
        SPOTIFY: artistSetting.spotifyUrl,
        APPLE: artistSetting.appleUrl,
      };
      const data = await saveArtist({
        name: artistSetting.name,
        image: artistSetting.image,
        profileUrls,
        instruction: artistSetting.instruction,
        label: artistSetting.label,
        knowledges: artistSetting.bases,
        artistId:
          saveMode === SETTING_MODE.CREATE
            ? ""
            : artistSetting.editableArtist?.account_id,
        email,
      });
      await getArtists(data.artist?.account_id);
      setUpdating(false);
      if (artistMode.settingMode === SETTING_MODE.CREATE)
        artistMode.setSettingMode(SETTING_MODE.UPDATE);
      return data.artist;
    } catch (error) {
      console.error(error);
      setUpdating(false);
      return null;
    }
  };

  useEffect(() => {
    getArtists();
  }, [getArtists]);

  return {
    sorted,
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist: handleSelectArtist,
    getArtists,
    updating,
    loading,
    saveSetting,
    ...artistSetting,
    ...artistMode,
    setMenuVisibleArtistId,
    menuVisibleArtistId,
    setIsLoading,
    isLoading,
    isCreatingArtist,
    setIsCreatingArtist,
    updateChatState,
  };
};

export default useArtists;
