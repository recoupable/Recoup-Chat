import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { SpotifyTrackSearchResult } from "@/types/spotify";

const SpotifyTrackCard = ({ track }: {track: SpotifyTrackSearchResult}) => {
  return (
    <Link
      href={track.external_urls?.spotify || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card className="overflow-hidden border-0 bg-transparent hover:bg-black/5 rounded-xl transition-colors h-full">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          {track.album?.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.album.images[0].url}
              alt={track.name || "Track cover"}
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
          <h4 className="font-medium text-sm line-clamp-1">{track.name}</h4>
          {track.artists && track.artists.length > 0 && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {track.artists.map(artist => artist.name).join(", ")}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpotifyTrackCard; 