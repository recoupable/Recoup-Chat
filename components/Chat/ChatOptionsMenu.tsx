import type { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";
import ChatOptions from "./ChatOptions";
import { useCallback } from "react";
import { useChatOptions } from "@/providers/ChatOptionsProvider";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
}

const ChatOptionsMenu = ({ 
  conversation, 
  onClose
}: ChatOptionsMenuProps) => {
  const isMobile = useIsMobile();
  const { openRenameModal, openDeleteModal } = useChatOptions();
  
  const handleRename = useCallback((e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    try {
      if (!e) return;
      e.stopPropagation();
      
      if (!conversation || !conversation.id) {
        console.error("Invalid conversation object in rename handler");
        return;
      }
      
      openRenameModal(conversation);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error in rename handler:", error);
      if (onClose) onClose();
    }
  }, [conversation, openRenameModal, onClose]);

  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    try {
      if (!e) return;
      e.stopPropagation();
      
      if (!conversation || !conversation.id) {
        console.error("Invalid conversation object in delete handler");
        return;
      }
      
      openDeleteModal(conversation);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error in delete handler:", error);
      if (onClose) onClose();
    }
  }, [conversation, openDeleteModal, onClose]);

  const closeMenus = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <ChatOptions 
      isMenuOpen={true}
      isMobile={isMobile}
      closeMenus={closeMenus}
      openRenameModal={handleRename}
      openDeleteModal={handleDelete}
    />
  );
};

export default ChatOptionsMenu; 