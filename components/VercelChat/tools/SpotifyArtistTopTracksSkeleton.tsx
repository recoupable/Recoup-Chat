import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const SpotifyArtistTopTracksSkeleton = () => {
  // Create an array of 10 items for skeleton placeholders
  const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image 
            src="/brand-logos/spotify.png" 
            alt="Spotify" 
            width={24} 
            height={24} 
            className="rounded-full"
          />
          <h3 className="font-semibold text-lg">Getting Top Tracks...</h3>
        </div>
        <Badge className="bg-[#1DB954] hover:bg-[#1DB954]/90 rounded-xl">Spotify</Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skeletonItems.map((item) => (
          <Card key={item} className="overflow-hidden border-0 bg-transparent rounded-xl h-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
            <CardContent className="p-3">
              <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpotifyArtistTopTracksSkeleton; 