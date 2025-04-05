import { Pencil, Trash2 } from "lucide-react";

interface ChatOptionsProps {
  isMenuOpen: boolean;
  isMobile: boolean;
  closeMenus: () => void;
  openRenameModal: (e: React.MouseEvent) => void;
  openDeleteModal: (e: React.MouseEvent) => void;
}

const ChatOptions = ({ 
  isMenuOpen, 
  isMobile, 
  closeMenus, 
  openRenameModal, 
  openDeleteModal 
}: ChatOptionsProps) => {
  if (!isMenuOpen && !isMobile) return null;

  return (
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
          onClick={openRenameModal}
        >
          <Pencil className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} /> Rename
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 w-full px-4 ${isMobile ? 'py-4 text-base' : 'py-2 text-sm'} text-left text-red-600 hover:bg-gray-100`}
          onClick={openDeleteModal}
        >
          <Trash2 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} /> Delete
        </button>
      </div>
    </>
  );
};

export default ChatOptions; 