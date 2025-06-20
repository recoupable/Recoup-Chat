import React from "react";
import Image from "next/image";

const GetSpotifyArtistAlbumsSkeleton: React.FC = () => {
  const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

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
        {skeletonItems.map((item) => (
          <div key={item} className="flex flex-col">
            <div className="relative pb-[100%] w-full overflow-hidden rounded-xl bg-gray-200 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSpotifyArtistAlbumsSkeleton; 