"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";
import { Conversation } from "@/types/Chat";

interface ChatOptionsProps {
  isMenuOpen: boolean;
  isMobile: boolean;
  closeMenus: () => void;
  openRenameModal: (e: React.MouseEvent) => void;
  openDeleteModal: (e: React.MouseEvent) => void;
  conversation?: Conversation;
}

const ChatOptions = ({ 
  isMenuOpen, 
  isMobile, 
  closeMenus, 
  openRenameModal, 
  openDeleteModal,
  conversation
}: ChatOptionsProps) => {
  const { openRenameModal: openGlobalRenameModal, openDeleteModal: openGlobalDeleteModal } = useModal();

  if (!isMenuOpen) return null;

  // Handle mobile direct modal opening, desktop uses passed handlers
  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If on mobile, directly call the modal provider
    if (isMobile && conversation) {
      // Close menu first, then open modal with delay to prevent UI issues
      closeMenus();
      setTimeout(() => {
        openGlobalRenameModal(conversation);
      }, 300);
    } else {
      // Regular behavior for desktop
      openRenameModal(e);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If on mobile, directly call the modal provider
    if (isMobile && conversation) {
      // Close menu first, then open modal with delay to prevent UI issues
      closeMenus();
      setTimeout(() => {
        openGlobalDeleteModal(conversation);
      }, 300);
    } else {
      // Regular behavior for desktop
      openDeleteModal(e);
    }
  };

  return (
    <>
      {/* The menu itself - moved to be first in DOM for better event capture */}
      <div 
        className={`absolute ${isMobile ? 'right-0 top-0' : 'right-0 top-full'} mt-1 w-36 z-50 bg-white border border-gray-200 rounded-md shadow-lg`}
        data-testid="chat-options-menu-content"
        onClick={(e) => e.stopPropagation()} // Stop clicks from bubbling
      >
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
          onClick={handleRenameClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            // Close menu first then open modal with delay
            if (isMobile && conversation) {
              closeMenus();
              setTimeout(() => {
                openGlobalRenameModal(conversation);
              }, 300);
            }
          }}
          data-testid="rename-button"
        >
          <Pencil className="h-4 w-4" /> Rename
        </button>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          onClick={handleDeleteClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            // Close menu first then open modal with delay
            if (isMobile && conversation) {
              closeMenus();
              setTimeout(() => {
                openGlobalDeleteModal(conversation);
              }, 300);
            }
          }}
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