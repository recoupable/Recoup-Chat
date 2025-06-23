import React from "react";
import { getSpotifyImage } from "@/lib/spotify/getSpotifyImage";
import Link from "next/link";

export type SpotifyCardVariant = "compact" | "grid";

export interface SpotifyCardProps {
  /** Unique identifier for the item */
  id: string;
  /** Display name/title */
  name: string;
  /** Optional subtitle (e.g., artist name, release year) */
  subtitle?: string;
  /** Spotify item data for image extraction */
  item: unknown;
  /** External URL (Spotify link) - if provided, card becomes a link */
  externalUrl?: string;
  /** Click handler - if provided and no externalUrl, card becomes clickable */
  onClick?: (name: string, id: string) => void;
  /** Visual variant - affects sizing and layout */
  variant?: SpotifyCardVariant;
  /** Additional CSS classes */
  className?: string;
}

const SpotifyCard: React.FC<SpotifyCardProps> = ({
  id,
  name,
  subtitle,
  item,
  externalUrl,
  onClick,
  variant = "compact",
  className = "",
}) => {
  const imageUrl = getSpotifyImage(item);
  
  const handleClick = () => {
    if (onClick && !externalUrl) {
      onClick(name, id);
    }
  };

  const baseClasses = "flex flex-col transition-all duration-200";
  const variantClasses: Record<SpotifyCardVariant, string> = {
    compact: "w-[140px] border border-gray-200 rounded-lg p-2 bg-white flex-shrink-0 text-center items-center justify-start cursor-pointer hover:bg-gray-50",
    grid: "cursor-pointer hover:scale-105"
  };

  const imageClasses: Record<SpotifyCardVariant, string> = {
    compact: "w-[100px] h-[100px] object-cover rounded-md mb-1 block",
    grid: "absolute inset-0 w-full h-full object-cover"
  };

  const titleClasses: Record<SpotifyCardVariant, string> = {
    compact: "font-medium text-[15px] max-w-[120px] truncate mx-auto",
    grid: "text-sm font-medium line-clamp-1"
  };

  const cardContent = (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Image Container */}
      {variant === "compact" && (
        <div className="w-full flex justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className={imageClasses[variant]}
            />
          ) : (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-md mb-1 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      )}

      {variant === "grid" && (
        <div className="relative pb-[100%] w-full overflow-hidden rounded-xl bg-gray-100 mb-2">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className={imageClasses[variant]}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
        </div>
      )}

      {/* Text Content */}
      <div className={titleClasses[variant]} title={name}>
        {name}
      </div>
      
      {subtitle && (
        <div className={variant === "compact" 
          ? "text-xs text-gray-500 max-w-[120px] truncate" 
          : "text-xs text-gray-500"
        }>
          {subtitle}
        </div>
      )}
    </div>
  );

  // Render as Link if externalUrl is provided
  if (externalUrl) {
    return (
      <Link
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        key={id}
      >
        {cardContent}
      </Link>
    );
  }

  // Render as clickable div if onClick is provided
  if (onClick) {
    return (
      <div key={id} onClick={handleClick}>
        {cardContent}
      </div>
    );
  }

  // Render as plain div
  return <div key={id}>{cardContent}</div>;
};

export default SpotifyCard;