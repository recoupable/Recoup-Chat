import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import { useState, useRef, useEffect } from "react";
import ChatItem from "./ChatItem";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import RenameModal from "./Modals/RenameModal";
import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";
import { useParams } from "next/navigation";

// Helper function to get a unique ID for either type of chat room
const getChatRoomId = (chatRoom: Conversation | ArtistAgent): string => {
  return "id" in chatRoom ? chatRoom.id : chatRoom.agentId;
};

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading, fetchConversations } =
    useConversationsProvider();
  const { handleClick } = useClickChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const isMobile = useMobileDetection();
  const params = useParams();

  // Add internal state to track active chat ID
  const [activeChatId, setActiveChatId] = useState<string | null>(
    typeof params?.roomId === 'string' ? params.roomId :
      typeof params?.agentId === 'string' ? params.agentId : null
  );

  // Because history.replaceState doesn't trigger events, we need to manually update the active chat ID (ref. useVercelChat hook, line 121)
  // Update activeChatId when conversations update
  useEffect(() => {
    const updateActiveChatId = () => {
      const urlChatId = window.location.pathname.match(/\/chat\/([^\/]+)/)

      if (urlChatId && urlChatId[1]) {
        setActiveChatId(urlChatId[1]);
      } else {
        // Handle params safely with type checking
        const roomId = typeof params?.roomId === 'string' ? params.roomId : null;
        const agentId = typeof params?.agentId === 'string' ? params.agentId : null;
        setActiveChatId(roomId || agentId || null);
      }
    };

    // Update on initial render and when dependencies change
    updateActiveChatId();
  }, [params, conversations]);

  // Modal states
  const [modalState, setModalState] = useState<{
    type: "rename" | "delete" | null;
    chatRoom: Conversation | ArtistAgent | null;
  }>({ type: null, chatRoom: null });

  // Refs for detecting outside clicks
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Handle closing the menu when clicking outside
  useOutsideClick({
    menuRef,
    buttonRefs,
    isOpen: !!openMenuId,
    onClose: () => setOpenMenuId(null),
  });

  // Modal action handlers
  const openModal = (
    type: "rename" | "delete",
    chatRoom: Conversation | ArtistAgent
  ) => {
    setModalState({ type, chatRoom });
    setOpenMenuId(null);
  };

  const closeModal = () => setModalState({ type: null, chatRoom: null });

  // API action handlers
  const handleApiAction = async () => {
    try {
      await fetchConversations();
    } catch (error) {
      console.error(
        `Error refreshing conversations after ${modalState.type}:`,
        error
      );
    }
  };

  const isRenameModalOpen = modalState.type === "rename";
  const isDeleteModalOpen = modalState.type === "delete";

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
            {conversations.map((chatRoom) => {
              const roomId = getChatRoomId(chatRoom);

              return (
                <ChatItem
                  key={roomId}
                  chatRoom={chatRoom}
                  isMobile={isMobile}
                  isHovered={hoveredChatId === roomId}
                  isMenuOpen={openMenuId === roomId}
                  isActive={roomId === activeChatId}
                  menuRef={openMenuId === roomId ? menuRef : null}
                  setButtonRef={(el: HTMLButtonElement | null) => {
                    buttonRefs.current[roomId] = el;
                  }}
                  onMouseEnter={() => setHoveredChatId(roomId)}
                  onMouseLeave={() => setHoveredChatId(null)}
                  onChatClick={() => handleClick(chatRoom, toggleModal)}
                  onMenuToggle={() => {
                    setOpenMenuId(openMenuId === roomId ? null : roomId);
                  }}
                  onRenameClick={() => openModal("rename", chatRoom)}
                  onDeleteClick={() => openModal("delete", chatRoom)}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Modals */}
      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeModal}
        chatRoom={modalState.chatRoom}
        onRename={handleApiAction}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        chatRoom={modalState.chatRoom}
        onDelete={handleApiAction}
      />
    </div>
  );
};

export default RecentChats;
