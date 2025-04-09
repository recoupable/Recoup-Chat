import { useState } from "react";
import { Conversation } from "@/types/Chat";
import useIsMobile from "@/hooks/useIsMobile";

export const useChatOptions = (conversation: Conversation, onClose?: () => void) => {
  console.log('[useChatOptions] Hook initialized with conversation:', conversation.id);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  console.log('[useChatOptions] Initial state:', { 
    isMenuOpen, 
    isMobile 
  });

  const closeMenus = () => {
    console.log('[useChatOptions] closeMenus called');
    setIsMenuOpen(false);
    if (onClose) {
      console.log('[useChatOptions] Calling onClose callback from closeMenus');
      onClose();
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    console.log('[useChatOptions] toggleMenu called, current state:', !isMenuOpen);
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    isMobile,
    closeMenus,
    toggleMenu
  };
}; 