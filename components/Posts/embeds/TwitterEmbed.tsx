import { useEffect, useState, useRef } from "react";
import { ExternalLink } from "lucide-react";

interface TwitterEmbedProps {
  url: string;
}

// Twitter widget options type
interface TwitterWidgetOptions {
  theme?: "light" | "dark";
  dnt?: boolean;
  conversation?: "all" | "none";
}

// Update TypeScript declaration for Twitter widget
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => Promise<HTMLElement[]>;
        createTweet: (
          id: string,
          element: HTMLElement,
          options?: TwitterWidgetOptions
        ) => Promise<HTMLElement>;
      };
    };
  }
}

export const TwitterEmbed = ({ url }: TwitterEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasAttemptedLoad = useRef(false);
  const tweetContainerRef = useRef<HTMLDivElement>(null);

  // Extract Twitter tweet ID from URL
  const extractTweetId = (url: string): string | null => {
    // Handle both twitter.com and x.com URLs
    const twitterRegex = /twitter\.com\/\w+\/status\/(\d+)/;
    const xRegex = /x\.com\/\w+\/status\/(\d+)/;

    const twitterMatch = url.match(twitterRegex);
    const xMatch = url.match(xRegex);

    return (twitterMatch && twitterMatch[1]) || (xMatch && xMatch[1]) || null;
  };

  // Load Twitter widget script and render tweet
  useEffect(() => {
    if (!hasAttemptedLoad.current && tweetContainerRef.current) {
      hasAttemptedLoad.current = true;

      const tweetId = extractTweetId(url);
      if (!tweetId) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      // Function to render the tweet
      const renderTweet = () => {
        if (window.twttr && tweetContainerRef.current) {
          try {
            // Clear any previous content
            while (tweetContainerRef.current.firstChild) {
              tweetContainerRef.current.removeChild(
                tweetContainerRef.current.firstChild
              );
            }

            // Create tweet directly using the API
            window.twttr.widgets
              .createTweet(tweetId, tweetContainerRef.current, {
                theme: "light",
                dnt: true,
                conversation: "none",
              })
              .then(() => {
                setIsLoading(false);
              })
              .catch(() => {
                setHasError(true);
                setIsLoading(false);
              });
          } catch {
            // Catch any errors during tweet creation
            setHasError(true);
            setIsLoading(false);
          }
        }
      };

      // Check if script is already in the document
      const existingScript = document.querySelector(
        'script[src="https://platform.twitter.com/widgets.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = renderTweet;
        script.onerror = () => {
          setHasError(true);
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } else {
        // If script is already loaded, just render the tweet
        renderTweet();
      }
    }
  }, [url]);

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

  if (hasError) {
    return renderFallbackLink();
  }

  return (
    <div className="twitter-embed relative overflow-hidden h-full min-h-[300px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          Loading...
        </div>
      )}
      <div ref={tweetContainerRef} className="h-full" />
    </div>
  );
};
