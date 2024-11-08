import { useArtistProvider } from "@/providers/ArtistProvider";
import { SETTING_MODE } from "@/types/Setting";

const MissingArtist = ({ description }: { description: string }) => {
  const { setIsOpenSettingModal, setSettingMode } = useArtistProvider();

  return (
    <div>
      <p className="text-sm">{description}</p>
      <fieldset className="pt-2 flex gap-2 items-center">
        <button
          type="button"
          onClick={() => {
            setSettingMode(SETTING_MODE.CREATE);
            setIsOpenSettingModal(true);
          }}
          className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
        >
          Create an artist.
        </button>
      </fieldset>
    </div>
  );
};

export default MissingArtist;
