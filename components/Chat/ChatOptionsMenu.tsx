import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";
import ChatOptions from "./ChatOptions";
import { useCallback } from "react";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

const ChatOptionsMenu = ({ 
  conversation, 
  onClose,
  onRename,
  onDelete
}: ChatOptionsMenuProps) => {
  const isMobile = useIsMobile();
  
  // Use callbacks to ensure stable references
  const handleRename = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (onRename) {
      onRename();
    } else if (onClose) {
      onClose();
    }
  }, [onRename, onClose]);

  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    } else if (onClose) {
      onClose();
    }
  }, [onDelete, onClose]);

  const closeMenus = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Add console log to verify props after component mounts
  console.log("ChatOptionsMenu props:", {
    hasConversation: !!conversation,
    hasOnRename: !!onRename,
    hasOnDelete: !!onDelete
  });

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