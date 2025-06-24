import React from "react";
import { Music } from "lucide-react";
import { SpotifyAlbum } from "@/lib/tools/getSpotifyAlbum";
import SpotifyAlbumWithTracksMeta from "./SpotifyAlbumWithTracksMeta";

interface SpotifyAlbumWithTracksHeroProps {
  result: SpotifyAlbum;
  totalDuration: number;
}

const SpotifyAlbumWithTracksHero: React.FC<SpotifyAlbumWithTracksHeroProps> = ({
  result,
  totalDuration,
}) => {
  const backgroundImage = result.images?.[0]?.url;

  return (
    <div className="relative rounded-2xl">
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center rounded-t-2xl opacity-[0.999]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          {/* Album Cover - Hidden on mobile */}
          <div className="flex-shrink-0 hidden sm:block">
            {backgroundImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={backgroundImage}
                alt={result.name}
                className="w-48 h-48 rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                <Music className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Album Info */}
          <SpotifyAlbumWithTracksMeta
            result={result}
            totalDuration={totalDuration}
          />
        </div>
      </div>
    </div>
  );
};

export default SpotifyAlbumWithTracksHero;
