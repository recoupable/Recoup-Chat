"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Conversation } from '@/types/Chat';
import RenameChatModal from '@/components/Chat/RenameChatModal';
import DeleteChatModal from '@/components/Chat/DeleteChatModal';
import useIsMobile from '@/hooks/useIsMobile';
import { useConversationsProvider } from './ConversationsProvider';
import { useRouter } from 'next/navigation';

// Create a context for the modal state
type ModalContextType = {
  openRenameModal: (conversation: Conversation) => void;
  openDeleteModal: (conversation: Conversation) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

// Hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Modal Provider component
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const isMobile = useIsMobile();
  const { fetchConversations, updateConversationName } = useConversationsProvider();
  const router = useRouter();
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true on client-side
  React.useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Open rename modal function
  const openRenameModal = (conversation: Conversation) => {
    console.log('[ModalProvider] Opening rename modal for conversation:', conversation.id);
    setCurrentConversation(conversation);
    setNewTopic(conversation.topic || '');
    setIsRenameModalOpen(true);
  };

  // Open delete modal function
  const openDeleteModal = (conversation: Conversation) => {
    console.log('[ModalProvider] Opening delete modal for conversation:', conversation.id);
    setCurrentConversation(conversation);
    setIsDeleteModalOpen(true);
  };

  // Handle rename function
  const handleRename = async () => {
    console.log('[ModalProvider] Renaming conversation');
    if (!currentConversation) return;
    
    try {
      await fetch(`/api/room/update?room_id=${currentConversation.id}&topic=${encodeURIComponent(newTopic)}`);
      updateConversationName(currentConversation.id, newTopic);
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  // Handle delete function
  const handleDelete = async () => {
    console.log('[ModalProvider] Deleting conversation');
    if (!currentConversation) return;
    
    try {
      await fetch(`/api/room/delete?room_id=${currentConversation.id}`);
      fetchConversations();
      setIsDeleteModalOpen(false);
      
      // Navigate to home page after deletion
      router.push('/');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <ModalContext.Provider 
      value={{ 
        openRenameModal, 
        openDeleteModal 
      }}
    >
      {children}

      {/* Render modals using portal for proper z-index and positioning */}
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