import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import DropDown from "./DropDown";
import { usePathname, useRouter } from "next/navigation";

const Artist = ({
  artist,
  isVisibleDropDown,
}: {
  artist: ArtistRecord;
  isVisibleDropDown: boolean;
}) => {
  const { setSelectedArtist, setMenuVisibleArtistId, selectedArtist } = useArtistProvider();
  const pathname = usePathname();
  const { push } = useRouter();

  const handleClick = () => {
    setMenuVisibleArtistId(null);
    
    // Only proceed with redirection if we're actually switching artists
    if (selectedArtist?.account_id !== artist.account_id) {
      // UUID pattern: 8-4-4-4-12 hexadecimal characters
      const uuidPattern = /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      // Only redirect if we're viewing an existing chat or funnel
      // This allows artist switching during chat creation from any path
      const isViewingExistingChat = uuidPattern.test(pathname);
      const isViewingFunnel = pathname.includes("/funnels");
      
      if (isViewingExistingChat || isViewingFunnel) {
        push("/");
      }
    }
    
    setSelectedArtist(artist);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDropDown = (e: any) => {
    e.preventDefault();
    setMenuVisibleArtistId(artist.id);
  };

  return (
    <div className="relative" id={artist.id}>
      <button
        type="button"
        className="w-[335px] h-[162px] overflow-hidden rounded-xl relative border-grey border"
        onClick={handleClick}
        onContextMenu={handleDropDown}
      >
        <ImageWithFallback
          src={artist.image || "https://i.imgur.com/QCdc8Ai.jpg"}
        />
        <div className="rounded-full flex items-center justify-center text-white absolute left-4 bottom-4">
          {artist.name}
        </div>
      </button>
      {isVisibleDropDown && <DropDown artist={artist} />}
    </div>
  );
};

export default Artist;
