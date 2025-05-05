import { ArtistRecord } from "@/types/Artist";
import Artist from "./Artist";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useUserProvider } from "@/providers/UserProvder";

const ArtistDropDown = ({
  setIsVisibleDropDown,
}: {
  setIsVisibleDropDown: Dispatch<SetStateAction<boolean>>;
}) => {
  const { sorted, toggleCreation } = useArtistProvider();
  const { isPrepared } = useUserProvider();

  const handleCreate = () => {
    if (!isPrepared()) return;
    toggleCreation();
  };

  return (
    <>
      <div
        className="absolute top-[calc(100%-5px)] right-0 z-[3] min-w-[120px]"
        onMouseOver={() => setIsVisibleDropDown(true)}
        onMouseOut={() => setIsVisibleDropDown(false)}
      >
        <div className="border mt-2 bg-white p-2 rounded-md space-y-1 shadow-[0px_0px_7px_0px_#80808063] max-h-[200px] overflow-y-auto">
          {sorted.map((artist: ArtistRecord | null) => (
            <Artist
              artist={artist}
              toggleDropDown={() => setIsVisibleDropDown(false)}
              key={artist?.account_id}
            />
          ))}
          <button
            className="flex px-2 py-1 gap-2 text-sm items-center text-grey-light-1 hover:text-grey-dark-1"
            onClick={handleCreate}
          >
            <div className="w-8 flex justify-center">
              <Plus className="size-5 text-grey-dark-1" />
            </div>
            New Artist
          </button>
        </div>
      </div>
      <div
        className="absolute top-[calc(100%-20px)] right-full space-y-1 h-[40px] w-[80px] z-[2]"
        onMouseOver={() => setIsVisibleDropDown(true)}
        onMouseOut={() => setIsVisibleDropDown(false)}
      />
    </>
  );
};

export default ArtistDropDown;
