import { useRef } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import ChatInput from "./ChatInput";
import ChatGreeting from "./ChatGreeting";
import ChatPrompt from "./ChatPrompt";
import useVisibilityDelay from "@/hooks/useVisibilityDelay";

/**
 * Initial chat interface that shows a greeting and prompt
 * with responsive layout for both mobile and desktop
 */
const InitialChat = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();

  // Determine if we have all the data needed to show the content
  const hasRequiredData = Boolean(
    userData !== undefined && selectedArtist !== undefined
  );

  const { isVisible } = useVisibilityDelay({
    shouldBeVisible: hasRequiredData,
    deps: [userData?.name, selectedArtist?.name],
  });

  return (
    <div className="size-full flex flex-col sm:items-center sm:justify-center">
      {/* Container with positioning logic */}
      <div className="w-full px-2 mt-16 sm:mt-0">
        <div
          ref={containerRef}
          className="max-w-3xl mx-auto px-3 py-2 lg:py-3 h-auto overflow-hidden"
        >
          {/* Content wrapper */}
          <div
            className={`
            transition-opacity duration-500 ease-in-out
            ${isVisible ? "opacity-100" : "opacity-0 invisible"}
          `}
          >
            {/* Greeting component */}
            <ChatGreeting isVisible={isVisible} />

            {/* Prompt component */}
            <ChatPrompt isVisible={isVisible} />
          </div>
        </div>
      </div>

      {/* Chat input section */}
      <div className="flex-grow flex items-end mb-6 sm:mb-0 sm:flex-grow-0 sm:mt-2">
        <div className="w-full px-2 flex justify-center">
          <div className="w-full max-w-3xl px-1">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialChat;
