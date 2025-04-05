import { X } from "lucide-react";
import { Button } from "../ui/button";

interface RenameChatModalProps {
  isOpen: boolean;
  isMobile: boolean;
  newTopic: string;
  setNewTopic: (topic: string) => void;
  handleRename: () => void;
  setIsRenameModalOpen: (isOpen: boolean) => void;
}

const RenameChatModal = ({ 
  isOpen,
  isMobile,
  newTopic,
  setNewTopic,
  handleRename,
  setIsRenameModalOpen
}: RenameChatModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.trim()) {
      handleRename();
    }
  };

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
          onClick={() => setIsRenameModalOpen(false)}
          aria-label="Close rename dialog"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-semibold mb-3">Rename Chat</h2>
        <form onSubmit={handleSubmit}>
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
              type="button"
              variant="outline"
              onClick={() => setIsRenameModalOpen(false)}
              className={isMobile ? 'text-base py-5 px-6' : ''}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newTopic.trim()}
              className={isMobile ? 'text-base py-5 px-6' : ''}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameChatModal; 