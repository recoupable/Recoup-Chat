import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Conversation } from "@/types/Chat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
}

const ChatOptionsMenu = ({ conversation, onClose }: ChatOptionsMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState(conversation.topic || "");
  const { fetchConversations } = useConversationsProvider();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsMenuOpen(true);
    }
  }, [isMobile]);

  const handleRename = async () => {
    try {
      await fetch(`/api/room/update?room_id=${conversation.id}&topic=${encodeURIComponent(newTopic)}`);
      fetchConversations();
      setIsRenameModalOpen(false);
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
      if (onClose) onClose();
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

  return (
    <>
      <div className="relative">
        {!isMobile && (
          <button
            type="button"
            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Chat options"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        )}

        {(isMenuOpen || isMobile) && (
          <>
            <div
              className={`fixed inset-0 z-10 ${isMobile ? 'bg-black/60 backdrop-blur-sm' : ''}`}
              onClick={closeMenus}
            />
            <div className={`${isMobile 
              ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm rounded-xl overflow-hidden' 
              : 'absolute right-0 mt-1 w-40'} bg-white border border-gray-200 rounded-md shadow-md z-20`}>
              <button
                type="button"
                className={`flex items-center gap-2 w-full px-4 ${isMobile ? 'py-4 text-base' : 'py-2 text-sm'} text-left hover:bg-gray-100`}
                onClick={(e) => {
                  e.stopPropagation();
                  openRenameModal();
                }}
              >
                <Pencil className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} /> Rename
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 w-full px-4 ${isMobile ? 'py-4 text-base' : 'py-2 text-sm'} text-left text-red-600 hover:bg-gray-100`}
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal();
                }}
              >
                <Trash2 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} /> Delete
              </button>
            </div>
          </>
        )}
      </div>

      {isRenameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#6262626b] bg-[url('/circle.png')] bg-center bg-cover px-3 md:px-0">
          <div className="relative bg-white rounded-md shadow-lg w-full max-w-md p-4 md:p-6">
            <button
              type="button"
              className="absolute top-3 right-3"
              onClick={() => setIsRenameModalOpen(false)}
              aria-label="Close rename dialog"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold mb-3">Rename Chat</h2>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6"
              placeholder="Enter new name"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRenameModalOpen(false)}
                className={isMobile ? 'text-base py-5 px-6' : ''}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRename}
                disabled={!newTopic.trim()}
                className={isMobile ? 'text-base py-5 px-6' : ''}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#6262626b] bg-[url('/circle.png')] bg-center bg-cover px-3 md:px-0">
          <div className="relative bg-white rounded-md shadow-lg w-full max-w-md p-4 md:p-6">
            <button
              type="button"
              className="absolute top-3 right-3"
              onClick={() => setIsDeleteModalOpen(false)}
              aria-label="Close delete dialog"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold mb-3">Delete Chat</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
                className={isMobile ? 'text-base py-5 px-6' : ''}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className={isMobile ? 'text-base py-5 px-6' : ''}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatOptionsMenu; 