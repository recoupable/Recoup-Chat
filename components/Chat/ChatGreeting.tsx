import { Plus_Jakarta_Sans } from "next/font/google";
import { useUserProvider } from "@/providers/UserProvder";
import useIsMobile from "@/hooks/useIsMobile";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

/**
 * Displays the greeting message with user's name
 * Accesses user data directly from providers
 */
export function ChatGreeting({ isVisible }: { isVisible: boolean }) {
  const { userData } = useUserProvider();
  const isMobile = useIsMobile();
  const firstName = userData?.name?.split(" ")[0] || "";
  const isLongName = firstName.length > 10;

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
        ${textStyle} ${isMobile ? "mb-2" : "mb-2"} ${fadeBase}
        ${isVisible ? fadeEnd : fadeStart}
      `}
    >
      {firstName ? (
        <div className="flex items-center">
          <span>Hey {firstName}</span>
          <span className="ml-1 mr-1 text-[16px] sm:text-[20px]">👋</span>
          {!isLongName && (
            <span className="hidden sm:inline">Welcome to Recoup</span>
          )}
        </div>
      ) : (
        <span>Welcome to Recoup</span>
      )}

      {/* For mobile with long names, show this line separately */}
      {isLongName && <div className="mt-1 sm:hidden">Welcome to Recoup</div>}
    </div>
  );
}

export default ChatGreeting;
