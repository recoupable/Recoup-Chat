import React from "react";
import SpotifyCard from "@/components/common/SpotifyCard";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album?: {
    images?: Array<{ url: string }>;
    name: string;
  };
  external_urls?: {
    spotify: string;
  };
  duration_ms?: number;
  preview_url?: string;
}

interface SpotifyTrackCardProps {
  track: SpotifyTrack;
  onClick?: (track: SpotifyTrack) => void;
  variant?: "compact" | "grid";
  showAlbum?: boolean;
}

const SpotifyTrackCard: React.FC<SpotifyTrackCardProps> = ({
  track,
  onClick,
  variant = "compact",
  showAlbum = true,
}) => {
  // Create subtitle based on artists and optionally album
  const createSubtitle = (): string => {
    const artistNames = track.artists.map(artist => artist.name).join(', ');
    if (showAlbum && track.album?.name) {
      return `${artistNames} • ${track.album.name}`;
    }
    return artistNames;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(track);
    }
  };

  return (
    <SpotifyCard
      id={track.id}
      name={track.name}
      subtitle={createSubtitle()}
      item={track}
      externalUrl={track.external_urls?.spotify}
      onClick={handleCardClick}
      variant={variant}
    />
  );
};

export default SpotifyTrackCard;