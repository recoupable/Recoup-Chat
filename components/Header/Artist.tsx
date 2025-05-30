import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import { EllipsisVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const isAnyArtistSelected = !!selectedArtist;
  const shouldHighlight = !isAnyArtistSelected; // Highlight when no artist is selected

  const pathname = usePathname();
  const { push, replace } = useRouter();

  const handleClick = () => {
    toggleDropDown();
    if (pathname.includes("/funnels") && selectedArtist) {
      if (selectedArtist.account_id !== artist?.account_id) push("/");
    }
    if (pathname.includes("/chat/") && selectedArtist) {
      if (selectedArtist.account_id !== artist?.account_id) {
        replace("/chat");
      }
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
    <motion.button
      initial={isMini ? false : true}
      layout="position"
      className={cn(
        "py-2 w-full outline-none",
        isMini
          ? [
              "flex justify-center items-center",
              isSelectedArtist && "w-fit rounded-full",
            ]
          : [
              "flex gap-3 items-center px-2 text-sm rounded-md text-grey-dark",
              isAnyArtistSelected && "hover:bg-grey-light-1",
              isSelectedArtist && "!bg-primary/10",
            ],
        shouldHighlight && "z-50 relative",
      )}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          className={cn(
            "w-8 h-8 aspect-1/1 rounded-full overflow-hidden flex items-center justify-center p-0.5 border-2 border-transparent transition-colors min-w-8 min-h-8 box-content",
            isSelectedArtist &&
              "shadow-[1px_1px_1px_1px_#E6E6E6] border-primary",
            shouldHighlight && "brightness-110 shadow-md ring-1 ring-white/30",
          )}
        >
          <ImageWithFallback
            src={artist?.image || ""}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      {!isMini && (
        <>
          <div
            key={artist?.account_id}
            className={cn(
              "text-left grow text-grey-dark",
              shouldHighlight && "font-medium",
            )}
            title={artist?.name || ""}
          >
            {displayName}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (artist) toggleUpdate(artist);
              toggleSettingModal();
            }}
            className={cn("ml-auto flex-shrink-0 opacity-0 pointer-events-none", {
              "opacity-1 pointer-events-auto": isHovered || isSelectedArtist,
            })}
            title="Edit artist settings"
            aria-label="Edit artist settings"
          >
            <EllipsisVertical className="size-5 rotate-90" />
          </button>
        </>
      )}
    </motion.button>
  );
};

export default Artist;
