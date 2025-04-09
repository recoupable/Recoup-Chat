"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import RenameChatModal from '@/components/Chat/RenameChatModal';
import DeleteChatModal from '@/components/Chat/DeleteChatModal';
import { Conversation } from '@/types/Chat';
import useIsMobile from '@/hooks/useIsMobile';
import { useConversationsProvider } from '@/providers/ConversationsProvider';
import { useRouter } from 'next/navigation';

// Define the context types
type ModalContextType = {
  openRenameModal: (conversation: Conversation) => void;
  openDeleteModal: (conversation: Conversation) => void;
  closeModals: () => void;
};

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Create a hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Create the provider component
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  // State for modals
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const isMobile = useIsMobile();
  const { updateConversationName, fetchConversations } = useConversationsProvider();
  const router = useRouter();
  
  // Check if we're in a browser environment (for SSR compatibility)
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Function to open rename modal
  const openRenameModal = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setNewTopic(conversation.topic || '');
    setIsRenameModalOpen(true);
  };

  // Function to open delete modal
  const openDeleteModal = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setIsDeleteModalOpen(true);
  };

  // Function to close all modals
  const closeModals = () => {
    setIsRenameModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  // Handle rename chat
  const handleRename = async () => {
    if (!currentConversation || !newTopic.trim()) return;
    
    try {
      await fetch(`/api/room/update?room_id=${currentConversation.id}&topic=${encodeURIComponent(newTopic)}`);
      
      // Update conversation name in context
      updateConversationName(currentConversation.id, newTopic);
      
      // Close modal
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  // Handle delete chat
  const handleDelete = async () => {
    if (!currentConversation) return;
    
    try {
      await fetch(`/api/room/delete?room_id=${currentConversation.id}`);
      
      // Close modal
      setIsDeleteModalOpen(false);
      
      // Refresh conversations and navigate home
      fetchConversations();
      router.push('/');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        openRenameModal,
        openDeleteModal,
        closeModals,
      }}
    >
      {children}

      {/* Render modals using portal */}
      {isBrowser && isRenameModalOpen && currentConversation && createPortal(
        <RenameChatModal
          isOpen={isRenameModalOpen}
          isMobile={isMobile}
          newTopic={newTopic}
          setNewTopic={setNewTopic}
          handleRename={handleRename}
          setIsRenameModalOpen={setIsRenameModalOpen}
        />,
        document.body
      )}

      {isBrowser && isDeleteModalOpen && currentConversation && createPortal(
        <DeleteChatModal
          isOpen={isDeleteModalOpen}
          isMobile={isMobile}
          handleDelete={handleDelete}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />,
        document.body
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider; 