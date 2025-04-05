import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import ChatOptionsMenu from "../Chat/ChatOptionsMenu";
import { useState, useCallback, useRef } from "react";
import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading } = useConversationsProvider();
  const { handleClick } = useClickChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Helper function to check if item is a Conversation
  const isConversation = (item: Conversation | ArtistAgent): item is Conversation => {
    return 'topic' in item && 'artist_id' in item;
  };

  // Get the appropriate ID from either type
  const getItemId = useCallback((item: Conversation | ArtistAgent): string => {
    if (isConversation(item)) {
      return item.id;
    }
    return item.agentId;
  }, []);

  const handleItemClick = useCallback((conversation: Conversation | ArtistAgent) => {
    handleClick(conversation, toggleModal);
  }, [handleClick, toggleModal]);

  const handleTouchStart = useCallback((conversation: Conversation | ArtistAgent) => {
    longPressTimerRef.current = setTimeout(() => {
      setMenuOpenChatId(getItemId(conversation));
    }, 500);
  }, [getItemId]);

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
            {conversations.map((conversation, index: number) => {
              const itemId = getItemId(conversation);
              return (
                <div
                  className="flex items-center w-full relative"
                  key={index}
                  onMouseEnter={() => !isMobile && setHoveredChatId(itemId)}
                  onMouseLeave={() => !isMobile && setHoveredChatId(null)}
                  onTouchStart={() => isMobile && handleTouchStart(conversation)}
                  onTouchEnd={() => isMobile && handleTouchEnd()}
                  onClick={() => handleItemClick(conversation)}
                >
                  <div 
                    className="flex gap-2 items-center w-full py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <p className="text-sm truncate max-w-[200px] text-left">
                      {isConversation(conversation) 
                        ? (conversation.topic || "Chat Analysis")
                        : conversation.type
                      }
                    </p>
                  </div>
                  {((hoveredChatId === itemId && !isMobile) || 
                    (menuOpenChatId === itemId && isMobile)) && 
                    isConversation(conversation) && (
                    <div className="absolute right-2">
                      <ChatOptionsMenu 
                        conversation={conversation} 
                        onClose={() => setMenuOpenChatId(null)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentChats;
