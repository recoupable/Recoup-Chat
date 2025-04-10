import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatRoom: Conversation | ArtistAgent | null;
  onRename: (newName: string) => void;
}

// Helper functions for type handling and data extraction
const isChatRoom = (item: Conversation | ArtistAgent): item is Conversation => 'id' in item;
const getChatName = (item: Conversation | ArtistAgent): string => isChatRoom(item) ? item.topic : item.type;
const getChatId = (item: Conversation | ArtistAgent): string => isChatRoom(item) ? item.id : item.agentId;

const RenameModal = ({ isOpen, onClose, chatRoom, onRename }: RenameModalProps) => {
  // Form state
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && chatRoom) {
      setName(getChatName(chatRoom));
      setError("");
      setTouched(false);
      setIsSubmitting(false);
    }
  }, [isOpen, chatRoom]);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to prevent visual flicker if modal is reopened quickly
      const timer = setTimeout(() => {
        setIsSubmitting(false);
        setError("");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen || !chatRoom) return null;

  // Validation function
  const validateName = (value: string): string => {
    const trimmed = value.trim();
    
    if (!trimmed) return "Chat name cannot be empty";
    if (trimmed.length < 3) return "Chat name must be at least 3 characters";
    if (trimmed.length > 50) return "Chat name cannot exceed 50 characters";
    if (/[<>{}]/g.test(trimmed)) return "Chat name contains invalid characters";
    
    return "";
  };

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (touched) setError(validateName(value));
  };
  
  const handleBlur = () => {
    setTouched(true);
    setError(validateName(name));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const roomId = getChatId(chatRoom);
      const response = await fetch('/api/room/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, newName: name }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to rename chat');
      }
      
      // Call the callback to update UI first
      onRename(name);
      
      // Only close the modal after rename is complete
      onClose();
    } catch (err) {
      console.error('Error renaming chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to rename chat. Please try again.');
      setIsSubmitting(false); // Make sure to reset isSubmitting on error
    }
  };

  // Don't allow closing the modal during submission
  const handleModalClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Compute derived state
  const isValid = !error && name.trim().length >= 3;
  const buttonText = isSubmitting ? 'Renaming...' : 'Rename';

  return (
    <Modal onClose={handleModalClose}>
      <div className="p-4 relative">
        <h2 className="text-xl font-semibold mb-5">Rename Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="text"
              id="chatName"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-base ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              value={name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter chat name"
            />
            <div className="h-5 mt-2">
              {error && <p className="text-red-500 text-sm animate-fadeIn">{error}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-5 py-2.5 text-base bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px] flex items-center justify-center font-medium"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting && (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              )}
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RenameModal; 