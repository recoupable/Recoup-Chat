import SideModal from "../SideModal";
import { useUserProvider } from "@/providers/UserProvder";
import Artist from "../Header/Artist";
import { ARTIST_INFO } from "@/types/Artist";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { Plus } from "lucide-react";

const SideArtists = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { email, isPrepared } = useUserProvider();
  const { toggleCreation, toggleSettingModal, sorted } = useArtistProvider();

  const handleCreate = () => {
    if (!isPrepared()) return;

    toggleCreation();
    toggleSettingModal();
  };
  return (
    <SideModal
      isVisible={isVisible}
      toggleModal={toggleModal}
      containerClasses="justify-end"
      direction="right"
      className="!w-fit"
    >
      <div className="no-scrollbar grow flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {email &&
          sorted.map((artist: ARTIST_INFO | null) => (
            <Artist
              artist={artist}
              toggleDropDown={() => {}}
              key={artist?.artist_id}
            />
          ))}
      </div>
      <button
        className="flex px-2 py-1 gap-2 text-sm items-center text-grey-dark-1"
        onClick={handleCreate}
      >
        <div className="w-8 flex justify-center">
          <Plus className="size-5 text-grey-dark-1" />
        </div>
        New Artist
      </button>
    </SideModal>
  );
};

export default SideArtists;
