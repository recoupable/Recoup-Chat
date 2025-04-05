import { MoreVertical } from "lucide-react";

interface ChatOptionsButtonProps {
  toggleMenu: (e: React.MouseEvent) => void;
}

const ChatOptionsButton = ({ toggleMenu }: ChatOptionsButtonProps) => {
  return (
    <button
      type="button"
      className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-150"
      onClick={toggleMenu}
      aria-label="Chat options"
    >
      <MoreVertical className="h-4 w-4 text-gray-500" />
    </button>
  );
};

export default ChatOptionsButton; 