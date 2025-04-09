"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";
import { Conversation } from "@/types/Chat";
import { useCallback } from "react";
import useIsMobile from "@/hooks/useIsMobile";

interface ChatOptionsProps {
  isMenuOpen: boolean;
  closeMenus: () => void;
  conversation?: Conversation;
}

const ChatOptions = ({ 
  isMenuOpen, 
  closeMenus, 
  conversation
}: ChatOptionsProps) => {
  const { openRenameModal, openDeleteModal } = useModal();
  const isMobile = useIsMobile();

  if (!isMenuOpen) return null;

  // Unified handler for both rename and delete actions
  const handleMenuAction = useCallback((action: 'rename' | 'delete', e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!conversation) return;
    
    // Determine which modal to open
    const modalToOpen = action === 'rename' ? openRenameModal : openDeleteModal;
    
    // For mobile, use a sequence of timeouts to ensure proper order of operations
    if (isMobile) {
      // First register the intent to open a modal
      const openModal = () => modalToOpen(conversation);
      
      // Then schedule the menu to close shortly after
      setTimeout(() => {
        closeMenus();
        
        // Finally open the modal after menu starts closing
        setTimeout(openModal, 50);
      }, 10);
    } else {
      // On desktop, open modal first, then close menu
      modalToOpen(conversation);
      closeMenus();
    }
  }, [conversation, openRenameModal, openDeleteModal, closeMenus, isMobile]);

  // Handle keyboard events for accessibility
  const handleKeyPress = (action: 'rename' | 'delete', e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleMenuAction(action, e);
    }
  };

  return (
    <>
      {/* The menu itself */}
      <div 
        className={`absolute right-0 ${isMobile ? 'top-0' : 'top-full'} mt-1 w-36 z-50 bg-white border border-gray-200 rounded-md shadow-lg`}
        data-testid="chat-options-menu-content"
        onClick={(e) => e.stopPropagation()} // Stop clicks from bubbling
      >
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
          onClick={(e) => handleMenuAction('rename', e)}
          onTouchEnd={(e) => handleMenuAction('rename', e)}
          onKeyDown={(e) => handleKeyPress('rename', e)}
          data-testid="rename-button"
        >
          <Pencil className="h-4 w-4" /> Rename
        </button>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          onClick={(e) => handleMenuAction('delete', e)}
          onTouchEnd={(e) => handleMenuAction('delete', e)}
          onKeyDown={(e) => handleKeyPress('delete', e)}
          data-testid="delete-button"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>

      {/* Backdrop to close menu (only on desktop) */}
      {!isMobile && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeMenus}
        />
      )}
    </>
  );
};

export default ChatOptions; 