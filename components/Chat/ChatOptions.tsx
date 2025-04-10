import { Pencil, Trash2 } from "lucide-react";

interface ChatOptionsProps {
  isMenuOpen: boolean;
  isMobile: boolean;
  closeMenus: () => void;
  openRenameModal: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => void;
  openDeleteModal: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => void;
}

const ChatOptions = ({ 
  isMenuOpen, 
  isMobile, 
  closeMenus, 
  openRenameModal, 
  openDeleteModal 
}: ChatOptionsProps) => {
  if (!isMenuOpen) return null;

  const handleBackdropClick = () => {
    closeMenus();
  };

  const handleMenuClick = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenus();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="presentation"
      />
      <div 
        className={`absolute ${isMobile ? 'right-0 top-0' : 'right-0 top-full'} mt-1 w-36 z-[100] bg-white border border-gray-200 rounded-md shadow-lg`}
        onClick={handleMenuClick}
        onKeyDown={handleKeyDown}
        role="menu"
      >
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
          onClick={openRenameModal}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openRenameModal(e);
            }
          }}
          role="menuitem"
        >
          <Pencil className="h-4 w-4" /> Rename
        </button>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          onClick={openDeleteModal}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openDeleteModal(e);
            }
          }}
          role="menuitem"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </>
  );
};

export default ChatOptions; 