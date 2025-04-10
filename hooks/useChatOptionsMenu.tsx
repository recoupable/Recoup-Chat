import { useState, useCallback } from "react";
import { useChatOptions } from "@/providers/ChatOptionsProvider";
import type { Conversation } from "@/types/Chat";

export const useChatOptionsMenu = () => {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const { openRenameModal, openDeleteModal } = useChatOptions();

  const handleMenuClick = useCallback((e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent, itemId: string) => {
    try {
      // Ensure we have a valid event
      if (!e) return;
      
      // Prevent default behavior and stop propagation
      e.stopPropagation();
      e.preventDefault();
      
      // Toggle menu state
      setMenuOpenChatId(prevId => prevId === itemId ? null : itemId);
    } catch (error) {
      console.error("Error in handleMenuClick:", error);
      // Fallback: Just toggle the menu without event handling
      setMenuOpenChatId(prevId => prevId === itemId ? null : itemId);
    }
  }, []);

  // Function to handle menu close
  const handleMenuClose = useCallback(() => {
    setMenuOpenChatId(null);
  }, []);

  // Handle opening modals - update to open modal first, then close menu
  const handleRenameClick = useCallback((conversation: Conversation) => {
    // First open the modal via the provider
    openRenameModal(conversation);
    // Then close the menu
    setMenuOpenChatId(null);
  }, [openRenameModal]);

  const handleDeleteClick = useCallback((conversation: Conversation) => {
    // First open the modal via the provider
    openDeleteModal(conversation);
    // Then close the menu
    setMenuOpenChatId(null);
  }, [openDeleteModal]);

  const handleMouseEnter = useCallback((isMobile: boolean, itemId: string) => {
    if (!isMobile) {
      setHoveredChatId(itemId);
    }
  }, []);

  const handleMouseLeave = useCallback((isMobile: boolean) => {
    if (!isMobile) {
      setHoveredChatId(null);
    }
  }, []);

  return {
    hoveredChatId,
    menuOpenChatId,
    handleMenuClick,
    handleMenuClose,
    handleRenameClick,
    handleDeleteClick,
    handleMouseEnter,
    handleMouseLeave
  };
}; 