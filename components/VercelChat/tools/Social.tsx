import { Social as SocialType } from "@/types/spotify";
import { getYoutubeChannelNameFromURL } from "@/utils/getYoutubeChannelNameFromURL";
import Link from "next/link";

const getSocialDisplayText = ({
  hasUsername,
  isYoutube,
  youtubeChannelName,
  username,
  social,
}: {
  hasUsername: boolean;
  isYoutube: boolean;
  youtubeChannelName: string;
  username: string;
  social: SocialType;
}) => {
  if (hasUsername) {
    return (
      <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-full">
        {username}
      </span>
    );
  } else if (isYoutube && youtubeChannelName) {
    return (
      <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-full">
        {youtubeChannelName}
      </span>
    );
  } else {
    return (
      <span className="text-xs text-gray-500 truncate max-w-full">
        {social.profile_url}
      </span>
    );
  }
};

export const Social = ({ social }: { social: SocialType }) => {
  const platform = social.profile_url.split("/")[0].split(".")[0];
  const displayName = platform === "open" ? "spotify" : platform;
  const hasUsername = Boolean(social.username && social.username.length > 0 && platform !== "youtube");
  const username = social.username.startsWith("@") ? social.username : `@${social.username}`;
  const isYoutube = platform === "youtube" || social.profile_url.includes("youtube.com");
  const youtubeChannelName = isYoutube ? getYoutubeChannelNameFromURL(social.profile_url) : "";

  return (
    <Link
      key={social.id}
      href={`https://${social.profile_url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-start p-4 border rounded-xl transition-all hover:shadow-md hover:scale-[1.02]`}
    >
      <span className="text-sm font-medium capitalize mb-1">{displayName}</span>
      {getSocialDisplayText({
        hasUsername,
        isYoutube,
        youtubeChannelName,
        username,
        social,
      })}
    </Link>
  );
};
