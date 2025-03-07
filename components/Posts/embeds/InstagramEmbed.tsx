import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface InstagramEmbedProps {
  url: string;
}

export const InstagramEmbed = ({ url }: InstagramEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract Instagram post ID from URL
  const extractPostId = (url: string): string | null => {
    const regex = /instagram\.com\/p\/([^/?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle loading completion
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Render fallback link if embedding fails
  const renderFallbackLink = () => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors h-full"
    >
      <span className="mr-2">View Instagram Post</span>
      <ExternalLink size={16} />
    </a>
  );

  // Check if we have a valid post ID
  const postId = extractPostId(url);
  if (!postId || hasError) {
    return renderFallbackLink();
  }

  return (
    <div className="instagram-embed relative overflow-hidden h-full min-h-[300px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          Loading...
        </div>
      )}
      <iframe
        src={`https://www.instagram.com/p/${postId}/embed`}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        title={`Instagram post ${postId}`}
      />
    </div>
  );
};
