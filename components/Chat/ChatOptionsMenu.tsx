"use client";

import { Conversation } from "@/types/Chat";
import { useModal } from "@/providers/ModalProvider";
import ChatOptions from "./ChatOptions";
import { useCallback } from "react";
import useIsMobile from "@/hooks/useIsMobile";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
  onModalIntent?: () => void;
}

const ChatOptionsMenu = ({ conversation, onClose, onModalIntent }: ChatOptionsMenuProps) => {
  const { openRenameModal, openDeleteModal } = useModal();
  const isMobile = useIsMobile();

  const handleOpenRenameModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Signal modal intent to parent on mobile to prevent menu closing
    if (isMobile && onModalIntent) {
      onModalIntent();
      
      // Small delay to ensure intent is registered before opening modal
      setTimeout(() => {
        openRenameModal(conversation);
      }, 50);
    } else {
      // On desktop, open modal immediately
      openRenameModal(conversation);
      
      // Only close menu on desktop
      if (!isMobile && onClose) {
        onClose();
      }
    }
  }, [conversation, isMobile, onClose, onModalIntent, openRenameModal]);

  const handleOpenDeleteModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Signal modal intent to parent on mobile to prevent menu closing
    if (isMobile && onModalIntent) {
      onModalIntent();
      
      // Small delay to ensure intent is registered before opening modal
      setTimeout(() => {
        openDeleteModal(conversation);
      }, 50);
    } else {
      // On desktop, open modal immediately
      openDeleteModal(conversation);
      
      // Only close menu on desktop
      if (!isMobile && onClose) {
        onClose();
      }
    }
  }, [conversation, isMobile, onClose, onModalIntent, openDeleteModal]);

  // Prevent event bubbling for the entire menu
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleContainerClick} 
      className="relative" 
      style={{ zIndex: 1000 }}
      data-testid="chat-options-menu"
    >
      <ChatOptions 
        isMenuOpen={true}
        isMobile={isMobile}
        closeMenus={onClose || (() => {})}
        openRenameModal={handleOpenRenameModal}
        openDeleteModal={handleOpenDeleteModal}
        conversation={conversation}
      />
    </div>
  );
};

export default ChatOptionsMenu; 