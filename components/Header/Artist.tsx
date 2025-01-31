import { useArtistProvider } from "@/providers/ArtistProvider";
import { ARTIST_INFO } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import { EllipsisVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Artist = ({
  artist,
  toggleDropDown,
  isMini,
}: {
  artist: ARTIST_INFO | null;
  toggleDropDown: () => void;
  isMini?: boolean;
}) => {
  const {
    setSelectedArtist,
    selectedArtist,
    toggleUpdate,
    toggleSettingModal,
  } = useArtistProvider();

  const isSelectedArtist = selectedArtist?.artist_id === artist?.artist_id;
  const pathname = usePathname();
  const { push } = useRouter();
  const handleClick = () => {
    toggleDropDown();
    if (pathname.includes("/funnels") && selectedArtist) {
      if (selectedArtist.artist_id !== artist?.artist_id) push("/");
    }
    setSelectedArtist(artist);
  };

  return (
    <button
      className={`${
        isMini
          ? `${isSelectedArtist && "w-fit rounded-full"}`
          : `flex gap-1 justify-between items-center px-2 text-sm rounded-md text-grey-dark hover:bg-grey-light-1 ${isSelectedArtist && "!bg-grey-light-1"}`
      } py-2`}
      type="button"
      onClick={handleClick}
    >
      <div
        className={`w-8 aspect-1/1 rounded-full overflow-hidden flex items-center justify-center ${isSelectedArtist && "shadow-[1px_1px_1px_1px_#E6E6E6]"}`}
      >
        <ImageWithFallback
          src={artist?.artist.account_info?.[0]?.image || ""}
        />
      </div>
      {!isMini && (
        <>
          <div
            key={artist?.artist_id}
            className="text-left max-w-[100px] truncate"
          >
            {artist?.artist.name}
          </div>
          <button
            type="button"
            onClick={() => {
              if (artist) toggleUpdate(artist);
              toggleSettingModal();
            }}
          >
            <EllipsisVertical className="size-5" />
          </button>
        </>
      )}
    </button>
  );
};

export default Artist;
