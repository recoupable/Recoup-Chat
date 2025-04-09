import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";

interface DeleteChatModalProps {
  isOpen: boolean;
  isMobile: boolean;
  handleDelete: () => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

const DeleteChatModal = ({ 
  isOpen,
  isMobile,
  handleDelete,
  setIsDeleteModalOpen
}: DeleteChatModalProps) => {
  // Reference to delete button for focus
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Trigger delete when Enter is pressed
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDelete();
      }
      
      // Close modal when Escape is pressed
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsDeleteModalOpen(false);
      }
    };

    // Focus the delete button when modal opens
    if (deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleDelete, setIsDeleteModalOpen]);

  // Prevent clicks from bubbling up to parent components
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[99999] bg-black bg-opacity-50 px-4"
      onClick={handleModalClick}
      data-testid="delete-modal"
    >
      <div 
        className="relative bg-white rounded-md shadow-lg w-full max-w-md p-4 md:p-6"
        onClick={handleModalClick}
        style={{ maxWidth: isMobile ? 'calc(100vw - 32px)' : '24rem' }}
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setIsDeleteModalOpen(false)}
          aria-label="Close delete dialog"
        >
          <X className="h-5 w-5" />
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
            ref={deleteButtonRef}
            variant="destructive"
            onClick={handleDelete}
            className={isMobile ? 'text-base py-5 px-6' : ''}
            data-testid="confirm-delete-button"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal; 