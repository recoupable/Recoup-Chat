import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getSpotifyImage } from "@/lib/spotify/getSpotifyImage";
import { getSpotifySubtitle, type SpotifyContent } from "@/lib/spotify/spotifyContentUtils";

interface SpotifyContentCardProps {
  content: SpotifyContent;
}

const SpotifyContentCard = ({ content }: SpotifyContentCardProps) => {
  const imageUrl = getSpotifyImage(content);
  const subtitle = getSpotifySubtitle(content);
  const spotifyUrl = content.external_urls?.spotify;
  const hasValidUrl = spotifyUrl && spotifyUrl !== "#";

  const cardContent = (
    <Card className={`overflow-hidden border-0 bg-transparent rounded-xl transition-colors h-full ${hasValidUrl ? 'hover:bg-black/5 group' : ''}`}>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={content.name || "Content cover"}
            className={`h-full w-full object-cover transition-transform duration-300 ${hasValidUrl ? 'group-hover:scale-105' : ''}`}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {hasValidUrl && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-[#1DB954] rounded-full p-2 shadow-lg">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h4 className="font-medium text-sm line-clamp-1">{content.name}</h4>
        {subtitle && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (hasValidUrl) {
    return (
      <Link
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default SpotifyContentCard;