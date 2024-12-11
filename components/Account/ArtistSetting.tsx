import Icon from "../Icon";
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
          className="p-2 rounded-md"
          onClick={() => setIsOpenSettingModal(true)}
        >
          <Icon name="micval" />
        </button>
      </Tooltip>
    </div>
  );
};

export default ArtistSetting;
