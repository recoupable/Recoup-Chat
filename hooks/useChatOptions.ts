import { useState, useCallback } from "react";
import { Conversation } from "@/types/Chat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import useIsMobile from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";

export const useChatOptions = (conversation: Conversation, onClose?: () => void) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState(conversation.topic || "");
  const { fetchConversations, updateConversationName } = useConversationsProvider();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleRename = async () => {
    try {
      await fetch(`/api/room/update?room_id=${conversation.id}&topic=${encodeURIComponent(newTopic)}`);
      updateConversationName(conversation.id, newTopic);
      setIsRenameModalOpen(false);
      
      // Only close menu on desktop
      if (!isMobile) {
        setIsMenuOpen(false);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/room/delete?room_id=${conversation.id}`);
      fetchConversations();
      setIsDeleteModalOpen(false);
      
      // Only close menu on desktop
      if (!isMobile) {
        setIsMenuOpen(false);
        if (onClose) onClose();
      }
      
      router.push('/');
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const closeMenus = useCallback(() => {
    setIsMenuOpen(false);
    if (!isMobile) {
      setIsRenameModalOpen(false);
      setIsDeleteModalOpen(false);
      if (onClose) onClose();
    }
  }, [isMobile, onClose]);

  const openRenameModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenameModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  }, []);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    setIsMenuOpen,
    isRenameModalOpen,
    setIsRenameModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    newTopic,
    setNewTopic,
    isMobile,
    handleRename,
    handleDelete,
    closeMenus,
    openRenameModal,
    openDeleteModal,
    toggleMenu
  };
}; 