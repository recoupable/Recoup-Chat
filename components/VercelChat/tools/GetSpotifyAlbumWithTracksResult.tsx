import React from "react";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink } from "lucide-react";
import { SpotifyAlbum } from "@/lib/tools/getSpotifyAlbum";
import { formatDuration } from "@/lib/spotify/formatDuration";
import Link from "next/link";
import SpotifyAlbumWithTracksHero from "./SpotifyAlbumWithTracksHero";

interface GetSpotifyAlbumWithTracksResultProps {
  result: SpotifyAlbum;
}

const GetSpotifyAlbumWithTracksResult: React.FC<
  GetSpotifyAlbumWithTracksResultProps
> = ({ result }) => {
  const totalDuration = result.tracks.items.reduce(
    (acc, track) => acc + track.duration_ms,
    0
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden max-w-2xl w-full my-4">
      {/* Hero Section */}
      <SpotifyAlbumWithTracksHero
        result={result}
        totalDuration={totalDuration}
      />

      {/* Track Listing */}
      <div className="bg-black/40 backdrop-blur-sm rounded-b-2xl opacity-[0.999]">
        <div className="p-3 sm:p-4">
          <div className="space-y-0.5">
            {result.tracks.items.map((track) => (
              <Link
                href={track.external_urls.spotify}
                key={track.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                  {/* Track Number */}
                  <div className="w-4 sm:w-5 text-center">
                    <span className="text-gray-400 text-xs group-hover:hidden">
                      {track.track_number}
                    </span>
                    <Play className="w-3 h-3 text-white hidden group-hover:block" />
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm truncate">
                        {track.name}
                      </span>
                      {track.explicit && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-600 text-white text-xs px-1 py-0 hidden sm:inline-flex"
                        >
                          E
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </div>
                  </div>

                  {/* Track Duration */}
                  <div className="text-xs text-gray-400 min-w-0">
                    {formatDuration(track.duration_ms)}
                  </div>

                  {/* Track Actions - Hidden on mobile */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    {track.external_urls?.spotify && (
                      <p className="text-gray-400 hover:text-white">
                        <ExternalLink className="w-3 h-3" />
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSpotifyAlbumWithTracksResult;
