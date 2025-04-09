import { Pencil, Trash2 } from "lucide-react";

interface ChatOptionsProps {
  isMenuOpen: boolean;
  isMobile: boolean;
  closeMenus: () => void;
  openRenameModal: (e: React.MouseEvent | React.TouchEvent) => void;
  openDeleteModal: (e: React.MouseEvent | React.TouchEvent) => void;
}

const ChatOptions = ({ 
  isMenuOpen, 
  isMobile, 
  closeMenus, 
  openRenameModal, 
  openDeleteModal 
}: ChatOptionsProps) => {
  if (!isMenuOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={closeMenus}
        onTouchEnd={closeMenus}
      />
      <div 
        className={`absolute ${isMobile ? 'right-0 top-0' : 'right-0 top-full'} mt-1 w-36 z-[100] bg-white border border-gray-200 rounded-md shadow-lg`}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
          onClick={openRenameModal}
          onTouchEnd={(e) => {
            e.preventDefault(); // Prevent ghost clicks
            openRenameModal(e);
          }}
        >
          <Pencil className="h-4 w-4" /> Rename
        </button>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          onClick={openDeleteModal}
          onTouchEnd={(e) => {
            e.preventDefault(); // Prevent ghost clicks
            openDeleteModal(e);
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </>
  );
};

export default ChatOptions; 