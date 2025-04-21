import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import { EllipsisVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  const isSelectedArtist = selectedArtist?.account_id === artist?.account_id;
  const pathname = usePathname();
  const { push } = useRouter();
  const handleClick = () => {
    toggleDropDown();
    if (pathname.includes("/funnels") && selectedArtist) {
      if (selectedArtist.account_id !== artist?.account_id) push("/");
    }
    setSelectedArtist(artist);
  };

  // Truncate name if longer than 12 characters
  const displayName = artist?.name 
    ? artist.name.length > 12 
      ? `${artist.name.substring(0, 12)}...` 
      : artist.name
    : "";

  return (
    <button
      className={`${
        isMini
          ? `${isSelectedArtist && "w-fit rounded-full"} flex justify-center items-center`
          : `flex gap-3 items-center px-2 text-sm rounded-md text-grey-dark hover:bg-grey-light-1 ${isSelectedArtist && "!bg-grey-light-1"}`
      } py-2 w-full`}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            className="text-left grow"
            title={artist?.name || ""}
          >
            {displayName}
          </div>
          {(isHovered || isSelectedArtist) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (artist) toggleUpdate(artist);
                toggleSettingModal();
              }}
              className="ml-auto flex-shrink-0"
              title="Edit artist settings"
              aria-label="Edit artist settings"
            >
              <EllipsisVertical className="size-5 rotate-90" />
            </button>
          )}
        </>
      )}
    </button>
  );
};

export default Artist;
