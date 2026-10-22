import React from "react";
import { SpotifyAlbum } from "@/types/spotify";
import SpotifyAlbumTrackRow from "./SpotifyAlbumTrackRow";
import SpotifyAlbumWithTracksHero from "./SpotifyAlbumWithTracksHero";

interface GetSpotifyAlbumWithTracksResultProps {
  result: SpotifyAlbum;
}

const GetSpotifyAlbumWithTracksResult: React.FC<
  GetSpotifyAlbumWithTracksResultProps
> = ({ result }) => {
  const tracks = result.tracks?.items ?? [];

  if (tracks.length === 0) {
    return (
      <p className="break-words text-sm text-muted-foreground">
        No tracks returned for {result.name || "this Spotify album"}.
      </p>
    );
  }

  const totalDuration = tracks.reduce(
    (acc, track) => acc + track.duration_ms,
    0,
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
            {tracks.map((track) => (
              <SpotifyAlbumTrackRow key={track.id} track={track} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSpotifyAlbumWithTracksResult;
