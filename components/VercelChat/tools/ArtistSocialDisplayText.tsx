import { getYoutubeChannelNameFromURL } from "@/lib/youtube/getYoutubeChannelNameFromURL";
import { Social as SocialType } from "@/types/spotify";

const ArtistSocialDisplayText = ({ social }: { social: SocialType }) => {
  const platform = social.profile_url.split("/")[0].split(".")[0];
  const hasUsername = Boolean(social.username && social.username.length > 0 && platform !== "youtube");
  const username = social.username.startsWith("@") ? social.username : `@${social.username}`;
  const isYoutube = platform === "youtube" || social.profile_url.includes("youtube.com");
  const youtubeChannelName = isYoutube ? getYoutubeChannelNameFromURL(social.profile_url) : "";

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

export default ArtistSocialDisplayText;
