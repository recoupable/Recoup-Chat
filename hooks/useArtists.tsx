import { useUserProvider } from "@/providers/UserProvder";
import { ARTIST_INFO } from "@/types/Artist";
import { useCallback, useEffect, useState } from "react";
import useArtistSetting from "./useArtistSetting";
import { SETTING_MODE } from "@/types/Setting";
import useArtistMode from "./useArtistMode";
import saveArtist from "@/lib/client/saveArtist";
import useInitialArtists from "./useInitialArtists";
import getArtistsOfAccount from "@/lib/client/getArtistsOfAccount";

const useArtists = () => {
  const artistSetting = useArtistSetting();
  const { email } = useUserProvider();
  const [artists, setArtists] = useState<ARTIST_INFO[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ARTIST_INFO | null>(
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
    (artist: ARTIST_INFO) => artist.artist_id === selectedArtist?.artist_id,
  );

  const sorted =
    selectedArtist && activeArtistIndex >= 0
      ? [
          selectedArtist,
          ...artists.slice(0, activeArtistIndex),
          ...artists.slice(activeArtistIndex + 1),
        ]
      : artists;

  const getArtists = useCallback(
    async (artistId?: string) => {
      if (!email) {
        setArtists([]);
        return;
      }
      const artists = await getArtistsOfAccount(email);
      setArtists(artists);
      if (artistId && artists.length > 0) {
        const newUpdatedInfo = artists.find(
          (artist: ARTIST_INFO) => artist.artist_id === artistId,
        );
        setSelectedArtist(newUpdatedInfo || null);
        return;
      }
    },
    [email],
  );
  const saveSetting = async () => {
    setUpdating(true);
    const saveMode = artistMode.settingMode;
    try {
      const profileUrls = [
        artistSetting.twitter,
        artistSetting.tiktok,
        artistSetting.youtube,
        artistSetting.instagram,
        artistSetting.spotifyUrl,
        artistSetting.appleUrl,
      ];
      const data = await saveArtist({
        name: artistSetting.name,
        image: artistSetting.image,
        profileUrls,
        instruction: artistSetting.instruction,
        label: artistSetting.label,
        knowledges: artistSetting.knowledges,
        artistId:
          saveMode === SETTING_MODE.CREATE
            ? ""
            : artistSetting.editableArtist?.artist_id,
        email,
      });
      await getArtists(data.artist?.artist_id);
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
  };
};

export default useArtists;
