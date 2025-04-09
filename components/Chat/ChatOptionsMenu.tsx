"use client";

import { Conversation } from "@/types/Chat";
import { useModal } from "@/providers/ModalProvider";
import ChatOptions from "./ChatOptions";
import { useCallback } from "react";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
}

const ChatOptionsMenu = ({ conversation, onClose }: ChatOptionsMenuProps) => {
  // Handlers are now simplified - no need for platform-specific logic
  const handleCloseMenu = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <div 
      className="relative" 
      style={{ zIndex: 1000 }}
      data-testid="chat-options-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <ChatOptions 
        isMenuOpen={true}
        closeMenus={handleCloseMenu}
        conversation={conversation}
      />
    </div>
  );
};

export default ChatOptionsMenu; 