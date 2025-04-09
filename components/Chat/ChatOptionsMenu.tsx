import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";
import ChatOptions from "./ChatOptions";

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
  console.log('[ChatOptionsMenu] Rendering with conversation:', conversation.id);
  
  const isMobile = useIsMobile();
  
  console.log('[ChatOptionsMenu] Props:', { isMobile, hasOnRename: !!onRename, hasOnDelete: !!onDelete });

  // Handlers for button clicks - call parent props
  const handleOpenRenameModal = (e: React.MouseEvent | React.TouchEvent) => {
    console.log('[ChatOptionsMenu] handleOpenRenameModal called, event type:', e.type);
    e.stopPropagation();
    
    if (onRename) {
      console.log('[ChatOptionsMenu] Calling parent onRename callback');
      onRename();
    } else {
      console.log('[ChatOptionsMenu] No onRename callback provided, just closing menu');
      if (onClose) onClose();
    }
  };

  const handleOpenDeleteModal = (e: React.MouseEvent | React.TouchEvent) => {
    console.log('[ChatOptionsMenu] handleOpenDeleteModal called, event type:', e.type);
    e.stopPropagation();
    
    if (onDelete) {
      console.log('[ChatOptionsMenu] Calling parent onDelete callback');
      onDelete();
    } else {
      console.log('[ChatOptionsMenu] No onDelete callback provided, just closing menu');
      if (onClose) onClose();
    }
  };

  const closeMenus = () => {
    if (onClose) onClose();
  };

  return (
    <ChatOptions 
      isMenuOpen={true}
      isMobile={isMobile}
      closeMenus={closeMenus}
      openRenameModal={handleOpenRenameModal}
      openDeleteModal={handleOpenDeleteModal}
    />
  );
};

export default ChatOptionsMenu; 