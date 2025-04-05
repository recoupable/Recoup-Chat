import { X } from "lucide-react";
import { Button } from "../ui/button";

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
  if (!isOpen) return null;

  // Prevent clicks from bubbling up to parent components
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#6262626b] bg-[url('/circle.png')] bg-center bg-cover px-3 md:px-0"
      onClick={handleModalClick}
    >
      <div 
        className="relative bg-white rounded-md shadow-lg w-full max-w-md p-4 md:p-6"
        onClick={handleModalClick}
      >
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
  );
};

export default DeleteChatModal; 