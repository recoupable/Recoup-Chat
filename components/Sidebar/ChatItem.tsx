import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import capitalize from "@/lib/capitalize";
import type { RefObject } from "react";

type ChatItemProps = {
  chatRoom: Conversation | ArtistAgent;
  isMobile: boolean;
  isHovered: boolean;
  isMenuOpen: boolean;
  isActive?: boolean;
  menuRef: RefObject<HTMLDivElement> | null;
  setButtonRef: (el: HTMLButtonElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onChatClick: () => void;
  onMenuToggle: () => void;
  onRenameClick: () => void;
  onDeleteClick: () => void;
};

// Helper functions consolidated into one
const getChatDisplayInfo = (item: Conversation | ArtistAgent) => {
  const isChatRoom = 'id' in item;
  const displayName = isChatRoom ? item.topic : capitalize(item.type);
  return { 
    displayName: displayName || `${capitalize(isChatRoom ? "Chat" : item.type)} Analysis`, 
    isChatRoom 
  };
};

const ChatItem = ({
  chatRoom,
  isMobile,
  isHovered,
  isMenuOpen,
  isActive = false,
  menuRef,
  setButtonRef,
  onMouseEnter,
  onMouseLeave,
  onChatClick,
  onMenuToggle,
  onRenameClick,
  onDeleteClick
}: ChatItemProps) => {
  const { displayName } = getChatDisplayInfo(chatRoom);
  const showOptions = isMobile || isHovered || isActive;

  return (
    <div 
      className={`flex gap-2 items-center w-full py-1.5 px-2 rounded-md transition-colors duration-150 relative ${
        isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="flex-grow text-left truncate max-w-[200px]"
        type="button"
        onClick={onChatClick}
      >
        <p className={`text-sm ${isActive ? 'font-medium' : ''}`}>
          {displayName}
        </p>
      </button>
      
      <button
        ref={setButtonRef}
        className={`shrink-0 p-1 text-gray-500 hover:text-gray-700 transition-colors duration-150 ${
          showOptions ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle();
        }}
        type="button"
        aria-label="Chat options"
      >
        <MoreHorizontal size={16} />
      </button>
      
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute right-2 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-32 border border-gray-100"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.key === 'Escape' && onMenuToggle()}
          tabIndex={-1}
          role="menu"
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors"
            onClick={onRenameClick}
            role="menuitem"
          >
            <Pencil size={14} className="text-gray-500" />
            <span>Rename</span>
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-red-50 text-sm text-red-500 flex items-center gap-2 transition-colors"
            onClick={onDeleteClick}
            role="menuitem"
          >
            <Trash2 size={14} className="text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
