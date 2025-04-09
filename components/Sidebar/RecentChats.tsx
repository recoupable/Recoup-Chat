import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import ChatOptionsMenu from "../Chat/ChatOptionsMenu";
import { useState, useCallback } from "react";
import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import { MoreVertical } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading } = useConversationsProvider();
  const { handleClick } = useClickChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { openRenameModal, openDeleteModal } = useModal();

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
    e.preventDefault();
    
    // Toggle menu state
    setMenuOpenChatId(prevId => prevId === itemId ? null : itemId);
  }, []);

  // Function to handle menu close
  const handleMenuClose = useCallback(() => {
    setMenuOpenChatId(null);
  }, []);

  // Direct modal handlers - bypass component lifecycle issues on mobile
  const handleDirectRename = useCallback((e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Close menu first to avoid component mounting issues
    setMenuOpenChatId(null);
    // Small timeout to ensure menu is closed before opening modal
    setTimeout(() => {
      openRenameModal(conversation);
    }, 300);
  }, [openRenameModal]);

  const handleDirectDelete = useCallback((e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Close menu first to avoid component mounting issues
    setMenuOpenChatId(null);
    // Small timeout to ensure menu is closed before opening modal
    setTimeout(() => {
      openDeleteModal(conversation);
    }, 300);
  }, [openDeleteModal]);

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
                  className="flex items-center justify-between w-full relative"
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
                      className="flex-shrink-0 mr-1 relative"
                    >
                      {/* Menu button - only visible on hover for desktop, always visible on mobile */}
                      {(isMobile || hoveredChatId === itemId || menuOpenChatId === itemId) && (
                        <button
                          type="button"
                          className="p-1.5 rounded-md hover:opacity-80 transition-opacity duration-150"
                          onClick={(e) => handleMenuClick(e, itemId)}
                          aria-label="Chat options"
                          data-testid="chat-menu-button"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      )}
                      
                      {/* Show options menu when the button is clicked */}
                      {menuOpenChatId === itemId && (
                        <>
                          {isMobile ? (
                            <div className="absolute right-0 top-full z-[100] mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg">
                              <button
                                type="button"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                                onClick={(e) => handleDirectRename(e, conversation as Conversation)}
                                data-testid="rename-button-mobile"
                              >
                                Rename
                              </button>
                              <button
                                type="button"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                                onClick={(e) => handleDirectDelete(e, conversation as Conversation)}
                                data-testid="delete-button-mobile"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="absolute right-0 top-0 z-[100]">
                              <ChatOptionsMenu 
                                conversation={conversation as Conversation} 
                                onClose={handleMenuClose}
                              />
                            </div>
                          )}
                        </>
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
