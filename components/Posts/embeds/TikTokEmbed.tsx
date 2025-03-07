import { useEffect, useState, useRef } from "react";
import { ExternalLink } from "lucide-react";

interface TikTokEmbedProps {
  url: string;
}

// Update TypeScript declaration for TikTok widget
declare global {
  interface Window {
    // TikTok doesn't expose a direct API object
    tiktokEmbed?: unknown;
  }
}

export const TikTokEmbed = ({ url }: TikTokEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasAttemptedLoad = useRef(false);
  const embedRef = useRef<HTMLDivElement>(null);

  // Extract TikTok video ID from URL
  const extractTikTokId = (url: string): string | null => {
    const regex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Load TikTok widget script
  useEffect(() => {
    if (!hasAttemptedLoad.current) {
      hasAttemptedLoad.current = true;

      // Check if script is already in the document
      const existingScript = document.querySelector(
        'script[src="https://www.tiktok.com/embed.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        script.onload = () => {
          // TikTok script automatically processes embeds when loaded
          setTimeout(() => {
            // Give a little time for the embed to process
            if (embedRef.current) {
              setIsLoading(false);
            }
          }, 1000);
        };
        script.onerror = () => setHasError(true);
        document.body.appendChild(script);
      } else {
        // If script is already loaded, just wait a bit for the embed to process
        setTimeout(() => {
          if (embedRef.current) {
            setIsLoading(false);
          }
        }, 1000);
      }
    }
  }, []);

  // Render fallback link if embedding fails
  const renderFallbackLink = () => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors h-full"
    >
      <span className="mr-2">View TikTok</span>
      <ExternalLink size={16} />
    </a>
  );

  // Check if we have a valid video ID
  const videoId = extractTikTokId(url);
  if (!videoId || hasError) {
    return renderFallbackLink();
  }

  return (
    <div
      ref={embedRef}
      className="tiktok-embed relative overflow-hidden h-full min-h-[300px]"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          Loading...
        </div>
      )}
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: "100%", minWidth: "325px" }}
      >
        <section></section>
      </blockquote>
    </div>
  );
};
