"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Conversation } from '@/types/Chat';
import RenameChatModal from '@/components/Chat/RenameChatModal';
import DeleteChatModal from '@/components/Chat/DeleteChatModal';
import useIsMobile from '@/hooks/useIsMobile';
import { useConversationsProvider } from './ConversationsProvider';
import { useRouter } from 'next/navigation';

type ChatOptionsContextType = {
  openRenameModal: (conversation: Conversation) => void;
  openDeleteModal: (conversation: Conversation) => void;
};

const ChatOptionsContext = createContext<ChatOptionsContextType | null>(null);

export function useChatOptions() {
  const context = useContext(ChatOptionsContext);
  if (!context) {
    throw new Error('useChatOptions must be used within a ChatOptionsProvider');
  }
  return context;
}

export const ChatOptionsProvider = ({ children }: { children: ReactNode }) => {
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

  const openRenameModal = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setNewTopic(conversation.topic || '');
    setIsRenameModalOpen(true);
  };

  const openDeleteModal = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setIsDeleteModalOpen(true);
  };

  const handleRename = async () => {
    if (!currentConversation) return;
    
    try {
      // Sanitize the topic to prevent URL issues
      const sanitizedTopic = newTopic.trim();
      
      // Check if topic is empty
      if (!sanitizedTopic) {
        return;
      }
      
      // Use proper URL encoding
      const encodedTopic = encodeURIComponent(sanitizedTopic);
      
      await fetch(`/api/room/update?room_id=${currentConversation.id}&topic=${encodedTopic}`);
      updateConversationName(currentConversation.id, sanitizedTopic);
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleDelete = async () => {
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
    <ChatOptionsContext.Provider 
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
    </ChatOptionsContext.Provider>
  );
}; 