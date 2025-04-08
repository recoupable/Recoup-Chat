import { useState } from "react";
import { Conversation } from "@/types/Chat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import useIsMobile from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";

export const useChatOptions = (conversation: Conversation, onClose?: () => void) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState(conversation.topic || "");
  const { fetchConversations, updateConversationName } = useConversationsProvider();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleRename = async () => {
    try {
      await fetch(`/api/room/update?room_id=${conversation.id}&topic=${encodeURIComponent(newTopic)}`);
      
      // Use updateConversationName instead of fetchConversations to prevent reordering
      updateConversationName(conversation.id, newTopic);
      
      // Close both the rename modal and the options menu
      setIsRenameModalOpen(false);
      setIsMenuOpen(false);
      
      // Call onClose to handle mobile menu state in parent component
      if (onClose) onClose();
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/room/delete?room_id=${conversation.id}`);
      fetchConversations();
      setIsDeleteModalOpen(false);
      
      // Navigate to home page after deletion
      router.push('/');
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    if (onClose) onClose();
  };

  const openRenameModal = () => {
    setIsRenameModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

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