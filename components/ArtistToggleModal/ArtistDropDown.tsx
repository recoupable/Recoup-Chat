import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import Image from "next/image";

const ArtistDropDown = ({ toggleModal }: { toggleModal: () => void }) => {
  const { artists, setSelectedArtist, artistActive, setArtistActive } =
    useArtistProvider();

  const handleClickArtist = (artist: ArtistRecord) => {
    setSelectedArtist(artist);
    toggleModal();
  };

  return (
    <div className="absolute border-[1px] border-gray-700 rounded-md p-2 bottom-0 right-0 bg-black h-[200px] overflow-y-scroll">
      <div className="flex flex-col gap-2">
        {artists.map((artist: ArtistRecord) => (
          <button
            key={artist.id}
            className="flex gap-2 items-center"
            type="button"
            onClick={() => handleClickArtist(artist)}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={artist.image || "/artists/luh tyler.png"}
                layout="fill"
                alt="not found icon"
              />
            </div>
            <p className="text-sm">{artist.name}</p>
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center mt-2">
        <div
          className="flex items-center border-[1px] border-gray-700 rounded-full w-10 h-[20px] pl-2"
          onClick={() => setArtistActive(!artistActive)}
        >
          <div
            className={`${artistActive ? "translate-x-[calc(100%+3px)]" : "translate-x-[-5px]"} 
                bg-[white] w-[15px] aspect-[1/1] rounded-full 
                transition duration-[300ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]`}
          />
        </div>
        <p className="text-sm">Artist Mode</p>
      </div>
    </div>
  );
};

export default ArtistDropDown;
