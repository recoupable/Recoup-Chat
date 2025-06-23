import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getSpotifyImage } from "@/lib/spotify/getSpotifyImage";
import {
  SpotifyArtistSearchResult,
  SpotifyAlbumSearchResult,
  SpotifyTrackSearchResult,
  SpotifyPlaylistSearchResult,
  SpotifyShowSearchResult,
  SpotifyEpisodeSearchResult,
  SpotifyAudiobookSearchResult,
} from "@/types/spotify";

// Union type for all Spotify content types
type SpotifyContent =
  | SpotifyArtistSearchResult
  | SpotifyAlbumSearchResult
  | SpotifyTrackSearchResult
  | SpotifyPlaylistSearchResult
  | SpotifyShowSearchResult
  | SpotifyEpisodeSearchResult
  | SpotifyAudiobookSearchResult;

interface SpotifyContentCardProps {
  content: SpotifyContent;
  onClick?: (name: string) => void;
}

const getSubtitle = (content: SpotifyContent): string => {
  switch (content.type) {
    case "track":
      return content.artists?.map(artist => artist.name).join(", ") || "";
    case "album":
      return content.artists?.map(artist => artist.name).join(", ") || "";
    case "playlist":
      return content.owner?.display_name || "";
    case "show":
      return content.publisher || "";
    case "episode":
      return content.description ? content.description.slice(0, 50) + "..." : "";
    case "audiobook":
      return content.publisher || "";
    case "artist":
      if (content.genres && content.genres.length > 0) {
        return content.genres.slice(0, 2).join(", ");
      }
      return content.followers ? `${content.followers.total.toLocaleString()} followers` : "";
    default:
      return "";
  }
};

const SpotifyContentCard = ({ content, onClick }: SpotifyContentCardProps) => {
  const imageUrl = getSpotifyImage(content);
  const subtitle = getSubtitle(content);
  const spotifyUrl = content.external_urls?.spotify || "#";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(content.name);
    }
  };

  return (
    <Link
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
      onClick={handleClick}
    >
      <Card className="overflow-hidden border-0 bg-transparent hover:bg-black/5 rounded-xl transition-colors h-full">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={content.name || "Content cover"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-[#1DB954] rounded-full p-2 shadow-lg">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h4 className="font-medium text-sm line-clamp-1">{content.name}</h4>
          {subtitle && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpotifyContentCard;