import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";

/**
 * Interface for ChatOptionsMenu props
 */
interface ChatOptionsMenuProps {
  /** Unique identifier for the chat */
  chatId: string;
  /** Callback fired when user wants to start renaming a chat */
  onStartRename: () => void;
  /** Callback fired when user confirms chat deletion */
  onDelete: (chatId: string) => Promise<void>;
}

/**
 * A dropdown menu component that provides options for managing a chat conversation
 * such as renaming and deleting. Used in the sidebar for each chat item.
 */
export default function ChatOptionsMenu({
  chatId,
  onStartRename,
  onDelete,
}: ChatOptionsMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4, // Adding 4px gap
        right: window.innerWidth - rect.right
      });
    }
  }, [isMenuOpen]);

  /**
   * Toggles the visibility of the options menu dropdown
   */
  const toggleMenu = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsDeleteConfirmOpen(false);
  };

  /**
   * Handles the rename button click, triggering the parent component's rename handler
   */
  const handleRename = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onStartRename();
  };

  /**
   * Toggles the delete confirmation dialog
   */
  const toggleDeleteConfirm = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
    setIsMenuOpen(false);
  };

  /**
   * Handles the delete confirmation, triggering the actual delete operation
   */
  const confirmDelete = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(chatId);
    setIsDeleteConfirmOpen(false);
  };

  /**
   * Cancels the delete operation, closing the confirmation dialog
   */
  const cancelDelete = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setIsDeleteConfirmOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="relative" onClick={(e: ReactMouseEvent) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1 rounded-full hover:bg-slate-100 transition-colors group-hover:opacity-100 opacity-0"
        aria-label="Chat options"
        aria-haspopup="menu"
      >
        <MoreVertical className="h-4 w-4 text-grey-dark" />
      </button>

      {isMenuOpen && (
        <div 
          className="fixed bg-white shadow-lg rounded-md py-1 z-50 w-36"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`
          }}
        >
          <button
            className="w-full text-left px-4 py-1 text-sm hover:bg-slate-100 transition-colors"
            onClick={handleRename}
          >
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-1 text-sm text-red-500 hover:bg-slate-100 transition-colors"
            onClick={toggleDeleteConfirm}
          >
            Delete
          </button>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center" 
          onClick={(e: ReactMouseEvent<HTMLDivElement>) => cancelDelete(e)}
        >
          <div className="fixed inset-0 bg-black opacity-20" />
          <div 
            className="bg-white shadow-lg rounded-md p-2 z-50 w-48 relative"
            onClick={(e: ReactMouseEvent) => e.stopPropagation()}
          >
            <p className="text-xs mb-2">Are you sure you want to delete this chat?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-2 py-1 text-xs rounded hover:bg-slate-100 transition-colors"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 