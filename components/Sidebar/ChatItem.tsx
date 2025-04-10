import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import { MoreVertical } from "lucide-react";
import { memo } from "react";
import ChatOptionsMenu from "../Chat/ChatOptionsMenu";
import useIsMobile from "@/hooks/useIsMobile";

interface ChatItemProps {
  conversation: Conversation | ArtistAgent;
  itemId: string;
  isHovered: boolean;
  isMenuOpen: boolean;
  isConversation: (item: Conversation | ArtistAgent) => item is Conversation;
  handleItemClick: (conversation: Conversation | ArtistAgent) => void;
  handleMenuClick: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent, itemId: string) => void;
  handleMenuClose: () => void;
}

const ChatItem = ({
  conversation,
  itemId,
  isHovered,
  isMenuOpen,
  isConversation,
  handleItemClick,
  handleMenuClick,
  handleMenuClose
}: ChatItemProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between w-full relative">
      {/* Chat title (clickable) */}
      <button 
        type="button"
        className="flex gap-2 items-center flex-grow py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer text-left"
        onClick={() => handleItemClick(conversation)}
      >
        <span className="text-sm truncate max-w-[200px]">
          {isConversation(conversation) 
            ? (conversation.topic || "Chat Analysis")
            : conversation.type
          }
        </span>
      </button>
      
      {/* Show menu button for both mobile and desktop */}
      {isConversation(conversation) && (
        <div className="flex-shrink-0 mr-1 relative">
          {/* Menu button - only visible on hover for desktop, always visible on mobile */}
          {(isMobile || isHovered || isMenuOpen) && (
            <button
              type="button"
              className="p-1.5 rounded-md hover:opacity-80 transition-opacity duration-150"
              onClick={(e) => handleMenuClick(e, itemId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMenuClick(e, itemId);
                }
              }}
              aria-label="Chat options"
              data-testid="chat-menu-button"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          )}
          
          {/* Show options menu when the button is clicked */}
          {isMenuOpen && (
            <div className="absolute right-0 top-0 z-[100]">
              {isConversation(conversation) ? (
                <ChatOptionsMenu 
                  conversation={conversation}
                  onClose={handleMenuClose}
                />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(ChatItem); 