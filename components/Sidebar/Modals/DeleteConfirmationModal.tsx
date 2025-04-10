import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatRoom: Conversation | ArtistAgent | null;
  onDelete: () => void;
}

// Helper functions for type handling and data extraction
const isChatRoom = (item: Conversation | ArtistAgent): item is Conversation => 'id' in item;
const getChatName = (item: Conversation | ArtistAgent): string => isChatRoom(item) ? item.topic : item.type;
const getChatId = (item: Conversation | ArtistAgent): string => isChatRoom(item) ? item.id : item.agentId;

const DeleteConfirmationModal = ({ isOpen, onClose, chatRoom, onDelete }: DeleteConfirmationModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to prevent visual flicker if modal is reopened quickly
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setError("");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen || !chatRoom) return null;
  
  const chatName = getChatName(chatRoom);
  const buttonText = isDeleting ? 'Deleting...' : 'Delete';
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    
    try {
      const roomId = getChatId(chatRoom);
      const response = await fetch('/api/room/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete chat');
      }
      
      // Call the onDelete callback to update the UI
      onDelete();
      
      // Only close the modal after deletion is complete
      onClose();
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete chat. Please try again.');
      setIsDeleting(false); // Make sure to reset isDeleting on error
    }
  };

  // Don't allow closing the modal during deletion
  const handleModalClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Modal onClose={handleModalClose}>
      <div className="p-4 relative">
        <h2 className="text-xl font-semibold mb-4">Delete Chat</h2>
        <p className="mb-5 text-base">
          Are you sure you want to delete &ldquo;{chatName}&rdquo;? This action cannot be undone.
        </p>
        
        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-5 py-2.5 text-base border border-gray-300 rounded-lg transition-colors duration-200 hover:bg-gray-100 min-w-[100px] flex items-center justify-center"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 text-base bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px] flex items-center justify-center font-medium"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal; 