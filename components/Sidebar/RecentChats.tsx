import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import ChatOptionsMenu from "../Chat/ChatOptionsMenu";
import { useState, useCallback } from "react";
import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import { MoreVertical } from "lucide-react";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading } = useConversationsProvider();
  const { handleClick } = useClickChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
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

  const handleMenuClick = useCallback((e: React.MouseEvent | React.TouchEvent, itemId: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any default behavior
    setMenuOpenChatId(itemId === menuOpenChatId ? null : itemId);
  }, [menuOpenChatId]);

  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-grey-light w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />
      <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark px-2 shrink-0">
        Recent Chats
      </p>
      <div className="overflow-y-auto space-y-1 md:space-y-1.5 flex-grow overflow-x-visible">
        {isLoading ? (
          <RecentChatSkeleton />
        ) : (
          <>
            {conversations.map((conversation, index: number) => {
              const itemId = getItemId(conversation);
              return (
                <div
                  className="flex items-center justify-between w-full relative overflow-visible"
                  key={index}
                  onMouseEnter={() => !isMobile && setHoveredChatId(itemId)}
                  onMouseLeave={() => !isMobile && setHoveredChatId(null)}
                >
                  {/* Chat title (clickable) */}
                  <div 
                    className="flex gap-2 items-center flex-grow py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleItemClick(conversation)}
                  >
                    <p className="text-sm truncate max-w-[200px] text-left">
                      {isConversation(conversation) 
                        ? (conversation.topic || "Chat Analysis")
                        : conversation.type
                      }
                    </p>
                  </div>
                  
                  {/* Show menu button for both mobile and desktop */}
                  {isConversation(conversation) && (
                    <div 
                      className="flex-shrink-0 mr-1"
                      onClick={(e) => handleMenuClick(e, itemId)}
                      onTouchEnd={(e) => isMobile && handleMenuClick(e, itemId)}
                    >
                      {/* Menu button - only visible on hover for desktop, always visible on mobile */}
                      {(isMobile || hoveredChatId === itemId || menuOpenChatId === itemId) && (
                        <button
                          type="button"
                          className="p-1.5 rounded-md hover:opacity-80 transition-opacity duration-150"
                          aria-label="Chat options"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      )}
                      
                      {/* Show options menu when the button is clicked */}
                      {menuOpenChatId === itemId && (
                        <ChatOptionsMenu 
                          conversation={conversation} 
                          onClose={() => setMenuOpenChatId(null)}
                        />
                      )}
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
