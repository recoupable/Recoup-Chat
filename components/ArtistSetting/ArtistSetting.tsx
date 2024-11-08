import { MicVocal } from "lucide-react";
import Tooltip from "../Tooltip";
import { useArtistProvider } from "@/providers/ArtistProvider";

const ArtistSetting = () => {
  const { setIsOpenSettingModal } = useArtistProvider();

  return (
    <div>
      <Tooltip
        id={"artists-tooltip"}
        message="Artist Setting"
        className="!z-[100]"
      >
        <button
          type="button"
          className="border-gray-700 border-[1px] p-2 rounded-md"
          onClick={() => setIsOpenSettingModal(true)}
        >
          <MicVocal />
        </button>
      </Tooltip>
    </div>
  );
};

export default ArtistSetting;
