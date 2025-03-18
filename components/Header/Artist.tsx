import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import { EllipsisVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Artist = ({
  artist,
  toggleDropDown,
  isMini,
}: {
  artist: ArtistRecord | null;
  toggleDropDown: () => void;
  isMini?: boolean;
}) => {
  const {
    setSelectedArtist,
    selectedArtist,
    toggleUpdate,
    toggleSettingModal,
  } = useArtistProvider();

  const isSelectedArtist = selectedArtist?.account_id === artist?.account_id;
  const pathname = usePathname();
  const { push } = useRouter();
  
  const handleClick = () => {
    toggleDropDown();
    
    const isArtistSwitch = selectedArtist?.account_id !== artist?.account_id;
    if (isArtistSwitch) {
      const chatUuidPattern = /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isViewingExistingChat = chatUuidPattern.test(pathname);
      const isViewingFunnel = pathname.includes("/funnels");
      
      if (isViewingExistingChat || isViewingFunnel) {
        push("/");
      }
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
      aria-label={`Select artist ${artist?.name || 'Unknown'}`}
    >
      <div
        className={`w-8 aspect-1/1 rounded-full overflow-hidden flex items-center justify-center ${isSelectedArtist && "shadow-[1px_1px_1px_1px_#E6E6E6]"}`}
      >
        <ImageWithFallback src={artist?.image || ""} />
      </div>
      {!isMini && (
        <>
          <div
            key={artist?.account_id}
            className="text-left max-w-[100px] truncate"
          >
            {artist?.name}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (artist) toggleUpdate(artist);
              toggleSettingModal();
            }}
            aria-label="Open artist settings"
          >
            <EllipsisVertical className="size-5" />
          </button>
        </>
      )}
    </button>
  );
};

export default Artist;
