import { type Social } from "@/hooks/useArtistFans";
import Image from "next/image";
import { useState } from "react";

// Base64 encoded simple placeholder avatar
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI2QxZDVkYiIvPjxwYXRoIGQ9Ik01MCwxODBjMC00MCw0MC02MCwxMDAtNjBzMTAwLDIwLDEwMCw2MHoiIGZpbGw9IiNkMWQ1ZGIiLz48L3N2Zz4=";

interface FanAvatarProps {
  fan: Social;
}

const FanAvatar = ({ fan }: FanAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Format follower count with commas
  const formattedFollowerCount = fan.followerCount.toLocaleString();

  // Use a fallback image if the avatar is null or if there was an error loading the image
  const imageSrc = imgError || !fan.avatar ? PLACEHOLDER_AVATAR : fan.avatar;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={fan.profile_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-square overflow-hidden rounded-full border border-gray-200 transition-all duration-300 group-hover:border-blue-500">
          <Image
            src={imageSrc}
            alt={fan.username || "Fan profile"}
            fill
            sizes="(max-width: 640px) 20vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, 10vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Hover overlay with fan info - only show on larger screens */}
        <div
          className={`absolute inset-0 hidden sm:flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-full text-white p-1 text-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-xs font-medium truncate w-full">
            {fan.username || "Anonymous"}
          </div>
          <div className="text-[10px] text-gray-300">
            {formattedFollowerCount}
          </div>
        </div>
      </a>
    </div>
  );
};

export default FanAvatar;
