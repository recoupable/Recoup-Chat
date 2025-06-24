import React from "react";
import { SpotifyArtistAlbumsResultUIType } from "@/types/spotify";
import SpotifyContentCard from "./SpotifyContentCard";
import Image from "next/image";

const GetSpotifyArtistAlbumsResult: React.FC<{
  result: SpotifyArtistAlbumsResultUIType;
}> = ({ result }) => {
  if (!result.items || result.items.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg">
        No albums found for this artist.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Image 
          src="/brand-logos/spotify.png" 
          alt="Spotify" 
          width={24} 
          height={24} 
          className="rounded-full"
        />
        <div className="font-semibold text-lg">Artist Albums</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {result.items.map((album) => (
          <SpotifyContentCard
            key={album.id}
            content={album}
          />
        ))}
      </div>
      {result.total > result.items.length && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {result.items.length} of {result.total} albums
        </div>
      )}
    </div>
  );
};

export default GetSpotifyArtistAlbumsResult; 