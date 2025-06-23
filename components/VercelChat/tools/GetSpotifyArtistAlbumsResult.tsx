import React from "react";
import { SpotifyArtistAlbumsResultUIType } from "@/types/spotify";
import Image from "next/image";
import SpotifyCard from "@/components/common/SpotifyCard";

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
        {result.items.map((album) => {
          const releaseYear = album.release_date ? new Date(album.release_date).getFullYear() : null;
          const albumUrl = album.external_urls?.spotify;
          
          return (
            <SpotifyCard
              key={album.id}
              id={album.id}
              name={album.name}
              subtitle={releaseYear?.toString()}
              item={album}
              externalUrl={albumUrl}
              variant="grid"
            />
          );
        })}
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