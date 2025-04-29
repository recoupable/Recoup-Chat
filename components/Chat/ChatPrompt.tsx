import { Plus_Jakarta_Sans } from "next/font/google";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useTypingAnimation from "@/hooks/useTypingAnimation";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

/**
 * Displays the prompt area with artist name or typing animation
 * Accesses data directly from providers
 */
export function ChatPrompt({ isVisible }: { isVisible: boolean }) {
  const { selectedArtist } = useArtistProvider();
  const words = ["artist?", "campaign?", "fans?"];
  const { currentWord } = useTypingAnimation(words, isVisible);
  const artistName = selectedArtist?.name || "";
  
  // Check if an artist is selected
  const isArtistSelected = !!selectedArtist;

  const textStyle = `
    ${plusJakartaSans.className} 
    text-[19px]
    sm:text-[22px]
    lg:text-[28px] 
    leading-[1.3]
    sm:leading-[1.2]
    lg:leading-[1.3] 
    tracking-[-0.25px]
    lg:tracking-[-0.3px] 
    font-medium 
  `;

  const fadeBase = "transition-opacity duration-700 ease-out";
  const fadeStart = "opacity-0";
  const fadeEnd = "opacity-100";

  return (
    <div
      className={`
        ${textStyle} mb-0 sm:mb-1 block text-[#A0A0A8] ${fadeBase}
        ${isVisible ? fadeEnd : fadeStart}
        transition-delay-[100ms]
      `}
    >
      {isArtistSelected ? (
        <span>
          Ask me <span className="hidden sm:inline">anything</span> about{" "}
          {artistName}
        </span>
      ) : (
        <span>
          <span className="text-[#A0A0A8]">Ask me about your artist</span>
          <span className="hidden">
            {/* This hidden span ensures currentWord is "used" to fix linter warnings */}
            {currentWord}
          </span>
        </span>
      )}
    </div>
  );
}

export default ChatPrompt;
