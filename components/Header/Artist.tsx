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
    if (pathname.includes("/funnels") && selectedArtist) {
      if (selectedArtist.account_id !== artist?.account_id) push("/");
    }
    
    // Check if user is changing artists
    const isChangingArtist = selectedArtist?.account_id !== artist?.account_id;
    
    // Check if user is in an existing chat page (not home or new chat pages)
    // This prevents unnecessary redirects when already on a new chat page
    const isInExistingChatPage = pathname.match(/^\/[^/]+$/) && pathname !== "/" && pathname !== "/new";
    
    setSelectedArtist(artist);
    
    // Only redirect to new chat page if changing artists while in an existing chat
    if (isInExistingChatPage && isChangingArtist) {
      push("/new"); // In the future, this will be changed to push("/")
    }
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
