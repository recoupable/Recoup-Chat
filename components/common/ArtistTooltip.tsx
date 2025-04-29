"use client";

import { getTooltipPositioning } from "@/utils/tooltipPositioning";

interface ArtistTooltipProps {
  isExpanded: boolean;
  hasArtists: boolean;
  message: string;
}

export const ArtistTooltip = ({
  isExpanded,
  hasArtists,
  message,
}: ArtistTooltipProps) => {
  const { position } = getTooltipPositioning(isExpanded, hasArtists);

  return (
    <div className={`${position} flex items-center gap-0`}>
      <div 
        className="bg-white text-black px-4 py-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center animate-bounce-gentle"
      >
        <span className="font-medium whitespace-nowrap text-base">{message}</span>
        <span className="ml-1.5 text-lg">👉</span>
      </div>
      <div className="w-3 h-3 bg-white transform rotate-45 -ml-1.5 shadow-[2px_2px_3px_rgba(0,0,0,0.08)]" />
    </div>
  );
}; 