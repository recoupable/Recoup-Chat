"use client";

import { type ArtistRecord } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { getArtistDisplayName, DEFAULT_ARTIST_IMAGE } from "@/utils/artistHelpers";

interface ArtistButtonProps {
  artist: ArtistRecord | null;
  isSelected?: boolean;
  isCompact?: boolean;
  showHighlight?: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  className?: string;
}

export const ArtistButton = ({
  artist,
  isSelected = false,
  isCompact = false,
  showHighlight = false,
  onSelect,
  onEdit,
  className = "",
}: ArtistButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const displayName = getArtistDisplayName(artist);

  const baseClasses = isCompact
    ? `${isSelected ? "w-fit rounded-full" : ""} flex justify-center items-center`
    : `flex gap-3 items-center px-2 text-sm rounded-md text-grey-dark ${!showHighlight ? 'hover:bg-grey-light-1' : ''} ${isSelected ? "!bg-grey-light-1" : ""}`;

  return (
    <button
      type="button"
      className={`${baseClasses} py-2 w-full ${showHighlight ? 'z-50 relative' : ''} ${className}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          className={`w-8 aspect-1/1 rounded-full overflow-hidden flex items-center justify-center ${
            isSelected ? "shadow-[1px_1px_1px_1px_#E6E6E6]" : ""
          } ${showHighlight ? 'brightness-110 shadow-md ring-1 ring-white/30' : ''}`}
        >
          <ImageWithFallback src={artist?.image || DEFAULT_ARTIST_IMAGE} />
        </div>
      </div>
      
      {!isCompact && (
        <>
          <div
            className={`text-left grow ${showHighlight ? 'font-medium text-white' : ''}`}
            title={artist?.name || ""}
          >
            {displayName}
          </div>
          {onEdit && (isHovered || isSelected) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
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