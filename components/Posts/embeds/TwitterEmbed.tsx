import { useEffect, useState, useRef } from "react";
import { ExternalLink } from "lucide-react";

interface TwitterEmbedProps {
  url: string;
}

// Add TypeScript declaration for Twitter widget
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

export const TwitterEmbed = ({ url }: TwitterEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasAttemptedLoad = useRef(false);

  // Extract Twitter tweet ID from URL
  const extractTweetId = (url: string): string | null => {
    // Handle both twitter.com and x.com URLs
    const twitterRegex = /twitter\.com\/\w+\/status\/(\d+)/;
    const xRegex = /x\.com\/\w+\/status\/(\d+)/;

    const twitterMatch = url.match(twitterRegex);
    const xMatch = url.match(xRegex);

    return (twitterMatch && twitterMatch[1]) || (xMatch && xMatch[1]) || null;
  };

  // Load Twitter widget script
  useEffect(() => {
    if (!hasAttemptedLoad.current) {
      hasAttemptedLoad.current = true;

      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load();
          }
        };
        script.onerror = () => setHasError(true);
        document.body.appendChild(script);
      } else {
        // If script is already loaded, just load the widgets
        window.twttr.widgets.load();
      }
    }
  }, []);

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
      <span className="mr-2">View Tweet</span>
      <ExternalLink size={16} />
    </a>
  );

  // Check if we have a valid tweet ID
  const tweetId = extractTweetId(url);
  if (!tweetId || hasError) {
    return renderFallbackLink();
  }

  return (
    <div className="twitter-embed relative overflow-hidden h-full min-h-[300px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          Loading...
        </div>
      )}
      <blockquote
        className="twitter-tweet"
        data-conversation="none"
        data-theme="light"
        data-dnt="true"
      >
        <a href={url}></a>
      </blockquote>
      <iframe
        style={{ display: "none" }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
