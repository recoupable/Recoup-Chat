import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import capitalize from "@/lib/capitalize";
import ChatOptionsMenu from "../Chat/ChatOptionsMenu";
import { useState, useCallback, useRef } from "react";
import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading } = useConversationsProvider();
  const { handleClick } = useClickChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleItemClick = useCallback((conversation: any) => {
    if (!isMobile) {
      handleClick(conversation, toggleModal);
    }
  }, [handleClick, isMobile, toggleModal]);

  const handleTouchStart = useCallback((conversation: any) => {
    longPressTimerRef.current = setTimeout(() => {
      setMenuOpenChatId(conversation.id);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-grey-light w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />
      <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark px-2 shrink-0">
        Recent Chats
      </p>
      <div className="overflow-y-auto space-y-1 md:space-y-1.5 flex-grow">
        {isLoading ? (
          <RecentChatSkeleton />
        ) : (
          <>
            {/* eslint-disable-next-line */}
            {conversations.map((conversation: any, index: number) => (
              <div
                className="flex items-center w-full relative"
                key={index}
                onMouseEnter={() => !isMobile && setHoveredChatId(conversation.id)}
                onMouseLeave={() => !isMobile && setHoveredChatId(null)}
                onTouchStart={() => isMobile && handleTouchStart(conversation)}
                onTouchEnd={() => isMobile && handleTouchEnd()}
                onClick={() => handleItemClick(conversation)}
              >
                <div 
                  className="flex gap-2 items-center w-full py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                >
                  <p className="text-sm truncate max-w-[200px] text-left">
                    {conversation?.topic ||
                      `${capitalize(conversation?.type)} Analysis`}
                  </p>
                </div>
                {((hoveredChatId === conversation.id && !isMobile) || 
                  (menuOpenChatId === conversation.id && isMobile)) && (
                  <div className="absolute right-2">
                    <ChatOptionsMenu 
                      conversation={conversation as Conversation} 
                      onClose={() => setMenuOpenChatId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentChats;
