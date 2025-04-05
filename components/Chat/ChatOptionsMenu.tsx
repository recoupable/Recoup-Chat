import { Conversation } from "@/types/Chat";
import { useChatOptions } from "@/hooks/useChatOptions";
import ChatOptionsButton from "./ChatOptionsButton";
import ChatOptions from "./ChatOptions";
import RenameChatModal from "./RenameChatModal";
import DeleteChatModal from "./DeleteChatModal";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
}

const ChatOptionsMenu = ({ conversation, onClose }: ChatOptionsMenuProps) => {
  const { 
    isMenuOpen, 
    setIsMenuOpen,
    isRenameModalOpen,
    isDeleteModalOpen,
    isMobile,
    newTopic,
    setNewTopic,
    handleRename,
    handleDelete,
    closeMenus,
    setIsRenameModalOpen,
    setIsDeleteModalOpen
  } = useChatOptions(conversation, onClose);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenRenameModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenameModalOpen(true);
  };

  const handleOpenDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="relative">
        {!isMobile && (
          <ChatOptionsButton toggleMenu={handleToggleMenu} />
        )}

        <ChatOptions 
          isMenuOpen={isMenuOpen}
          isMobile={isMobile}
          closeMenus={closeMenus}
          openRenameModal={handleOpenRenameModal}
          openDeleteModal={handleOpenDeleteModal}
        />
      </div>

      <RenameChatModal 
        isOpen={isRenameModalOpen}
        isMobile={isMobile}
        newTopic={newTopic}
        setNewTopic={setNewTopic}
        handleRename={handleRename}
        setIsRenameModalOpen={setIsRenameModalOpen}
      />

      <DeleteChatModal 
        isOpen={isDeleteModalOpen}
        isMobile={isMobile}
        handleDelete={handleDelete}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
    </>
  );
};

export default ChatOptionsMenu; 