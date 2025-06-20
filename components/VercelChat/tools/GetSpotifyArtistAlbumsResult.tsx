import React from "react";
import { SpotifyArtistAlbumsResultUIType } from "@/types/spotify";
import { getSpotifyImage } from "@/lib/spotify/getSpotifyImage";
import Link from "next/link";
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
        {result.items.map((album) => {
          const releaseYear = album.release_date ? new Date(album.release_date).getFullYear() : null;
          const albumUrl = album.external_urls?.spotify;
          
          return (
            <Link
              key={album.id}
              href={albumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="relative pb-[100%] w-full overflow-hidden rounded-xl bg-gray-100 mb-2">
                {getSpotifyImage(album) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getSpotifyImage(album)}
                    alt={album.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="text-sm font-medium line-clamp-1" title={album.name}>
                {album.name}
              </div>
              {releaseYear && (
                <div className="text-xs text-gray-500">{releaseYear}</div>
              )}
            </Link>
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