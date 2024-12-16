import { useArtistProvider } from "@/providers/ArtistProvider";
import { SETTING_MODE } from "@/types/Setting";

const useSaveTiktokArtist = () => {
  const { saveSetting, setSelectedArtist } = useArtistProvider();

  const saveTiktokArtist = async (profileWithComments: any) => {
    while (1) {
      const artistInfo = await saveSetting(
        "aaa",
        "aaa",
        `https://tiktok.com/@aaa`,
        SETTING_MODE.CREATE,
      );
      if (artistInfo) {
        setSelectedArtist({ ...artistInfo });
        return artistInfo?.id;
      }
    }
  };

  return {
    saveTiktokArtist,
  };
};

export default useSaveTiktokArtist;
