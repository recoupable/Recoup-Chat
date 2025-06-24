import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Music, ExternalLink } from "lucide-react";
import { SpotifyAlbum } from "@/lib/tools/getSpotifyAlbum";
import { formatDuration } from "@/lib/spotify/formatDuration";
import Link from "next/link";

interface SpotifyAlbumWithTracksMetaProps {
  result: SpotifyAlbum;
  totalDuration: number;
}

const SpotifyAlbumWithTracksMeta: React.FC<SpotifyAlbumWithTracksMetaProps> = ({
  result,
  totalDuration,
}) => {
  const spotifyUrl = result.external_urls?.spotify;

  return (
    <div className="flex-1 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="secondary"
          className="bg-white/20 text-white border-0 capitalize rounded-full select-none text-xs"
        >
          {result.album_type}
        </Badge>
      </div>

      <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
        {result.name}
      </h1>

      <div className="flex items-center gap-2 text-sm sm:text-base mb-3">
        <span className="font-medium">
          {result.artists.map((artist) => artist.name).join(", ")}
        </span>
      </div>

      {/* Album Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-300">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(result.release_date).getFullYear()}
        </div>
        <div className="flex items-center gap-1">
          <Music className="w-3 h-3" />
          {result.total_tracks} songs
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(totalDuration)}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        {spotifyUrl && (
          <Link
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black px-4 sm:px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Listen on Spotify</span>
            <span className="sm:hidden">Listen</span>
          </Link>
        )}
      </div>

      {/* Label and Genres */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {result.label && (
          <Badge
            variant="outline"
            className="border-white/30 text-white bg-white/10 text-xs rounded-full select-none"
          >
            {result.label}
          </Badge>
        )}
        {result.genres?.slice(0, 2).map((genre, index) => (
          <Badge
            key={index}
            variant="outline"
            className="border-white/30 text-white bg-white/10 text-xs"
          >
            {genre}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SpotifyAlbumWithTracksMeta; 