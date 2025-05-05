import SideModal from "../SideModal";
import { useUserProvider } from "@/providers/UserProvder";
import Artist from "../Header/Artist";
import { ArtistRecord } from "@/types/Artist";
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
  const { toggleCreation, sorted } = useArtistProvider();

  const handleCreate = () => {
    if (!isPrepared()) return;
    toggleCreation();
    toggleModal();
  };

  return (
    <SideModal
      isVisible={isVisible}
      toggleModal={toggleModal}
      containerClasses="justify-end"
      direction="right"
      className="w-[250px]"
    >
      <div className="no-scrollbar grow flex flex-col gap-1 overflow-y-auto overflow-x-hidden w-full">
        {email &&
          sorted.map((artist: ArtistRecord | null) => (
            <Artist
              artist={artist}
              toggleDropDown={() => toggleModal()}
              key={artist?.account_id}
            />
          ))}
      </div>
      <button
        className="flex px-2 py-1 gap-2 text-sm items-center text-grey-dark-1 w-full hover:bg-gray-50"
        onClick={handleCreate}
        type="button"
      >
        <div className="w-8 flex justify-center">
          <Plus className="size-5 text-grey-dark-1" />
        </div>
        <span className="text-left grow">New Artist</span>
      </button>
    </SideModal>
  );
};

export default SideArtists;
