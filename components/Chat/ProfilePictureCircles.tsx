import ImageWithFallback from "../ImageWithFallback";
import { Database } from "@/types/database.types";

type Social = Database["public"]["Tables"]["socials"]["Row"];

interface ProfilePictureCirclesProps {
  fans: Social[];
  maxDisplayed?: number;
}

export const ProfilePictureCircles = ({ fans }: ProfilePictureCirclesProps) => {
  const fansWithAvatars = fans.filter(
    (fan): fan is Social & { avatar: string } => fan.avatar !== null
  );

  if (fansWithAvatars.length === 0) {
    return null;
  }

  const displayedFans = fansWithAvatars;
  const remainingCount = fans.length - displayedFans.length;

  return (
    <div className="flex flex-wrap items-center gap-2 max-w-[500px]">
      {displayedFans.map((fan) => (
        <div key={fan.id} className="relative group" title={fan.username}>
          <ImageWithFallback
            src={fan.avatar}
            className="w-8 h-8 rounded-full object-cover border border-gray-200 hover:border-blue-400 transition-colors"
          />
          {fan.bio && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {fan.bio}
            </div>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <span className="text-sm text-gray-500">and {remainingCount} more</span>
      )}
    </div>
  );
};

export default ProfilePictureCircles;
