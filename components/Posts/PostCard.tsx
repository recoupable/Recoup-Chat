import { type Post } from "@/hooks/useArtistPosts";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);

  // Format the date to a more readable format
  const formattedDate = new Date(post.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Determine the platform from the URL
  const getPlatform = (url: string): string => {
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("facebook.com")) return "facebook";
    if (url.includes("tiktok.com")) return "tiktok";
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    return "unknown";
  };

  const platform = getPlatform(post.post_url);

  // Handle loading state
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle error state
  const handleError = () => {
    setIsLoading(false);
    setEmbedError(true);
  };

  // Render a fallback link if embedding fails
  const renderFallbackLink = () => (
    <a
      href={post.post_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors h-full"
    >
      <span className="mr-2">View Post</span>
      <ExternalLink size={16} />
    </a>
  );

  // Render the appropriate embed based on the platform
  const renderEmbed = () => {
    if (embedError) return renderFallbackLink();

    switch (platform) {
      case "twitter":
        return (
          <div className="twitter-embed relative overflow-hidden h-full min-h-[300px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                Loading...
              </div>
            )}
            <iframe
              src={`https://platform.twitter.com/embed/index.html?url=${encodeURIComponent(post.post_url)}`}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        );
      case "instagram":
        return (
          <div className="instagram-embed relative overflow-hidden h-full min-h-[300px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                Loading...
              </div>
            )}
            <iframe
              src={`https://www.instagram.com/p/${post.post_url.split("/p/")[1].split("/")[0]}/embed`}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        );
      default:
        return renderFallbackLink();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col">
      <div className="p-3 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium capitalize">{platform}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
      </div>
      <div className="flex-grow">{renderEmbed()}</div>
    </div>
  );
};

export default PostCard;
