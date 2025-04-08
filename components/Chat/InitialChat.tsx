import { useEffect, useState, useRef } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useIsMobile from "@/hooks/useIsMobile";
import useTypingAnimation from "@/hooks/useTypingAnimation";
import ChatInput from "./ChatInput";
import ChatGreeting from "./ChatGreeting";
import ChatPrompt from "./ChatPrompt";

/**
 * Initial chat interface that shows a greeting and prompt
 * with responsive layout for both mobile and desktop
 */
const InitialChat = () => {
  // Refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  
  // Data providers
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  
  // Computed values
  const firstName = userData?.name?.split(' ')[0] || "";
  const isLongName = firstName.length > 10;
  const artistName = selectedArtist?.name || "";
  const hasRequiredData = Boolean(userData !== undefined && selectedArtist !== undefined);

  // Typing animation
  const words = ["artist?", "campaign?", "fans?"];
  const { currentWord } = useTypingAnimation(words, isVisible);

  // Trigger visibility once we have the complete data we need
  useEffect(() => {
    // Only show content when we have data AND required fields are loaded
    if (!hasRequiredData) return;
    
    // Give browser time to prepare before revealing content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [hasRequiredData, userData?.name, selectedArtist?.name]);

  return (
    <div className="size-full flex flex-col sm:items-center sm:justify-center">
      {/* Container with positioning logic */}
      <div className="w-full px-2 mt-16 sm:mt-0">
        <div 
          ref={containerRef}
          className="max-w-3xl mx-auto px-3 py-2 lg:py-3 h-auto overflow-hidden"
        >
          {/* Content wrapper */}
          <div className={`
            transition-opacity duration-500 ease-in-out
            ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}
          `}>
            {/* Greeting component */}
            <ChatGreeting 
              firstName={firstName}
              isLongName={isLongName}
              isVisible={isVisible}
              isMobile={isMobile}
            />
            
            {/* Prompt component */}
            <ChatPrompt
              artistName={artistName}
              currentWord={currentWord}
              isVisible={isVisible}
            />
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
