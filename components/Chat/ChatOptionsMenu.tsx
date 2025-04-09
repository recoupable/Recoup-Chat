import { Conversation } from "@/types/Chat";
import { useChatOptions } from "@/hooks/useChatOptions";
import ChatOptions from "./ChatOptions";
import RenameChatModal from "./RenameChatModal";
import DeleteChatModal from "./DeleteChatModal";

interface ChatOptionsMenuProps {
  conversation: Conversation;
  onClose?: () => void;
}

const ChatOptionsMenu = ({ conversation, onClose }: ChatOptionsMenuProps) => {
  const { 
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

  const handleOpenRenameModal = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    if (isMobile) {
      closeMenus();
      setTimeout(() => {
        setIsRenameModalOpen(true);
      }, 200);
    } else {
      setIsRenameModalOpen(true);
      closeMenus();
    }
  };

  const handleOpenDeleteModal = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    if (isMobile) {
      closeMenus();
      setTimeout(() => {
        setIsDeleteModalOpen(true);
      }, 200);
    } else {
      setIsDeleteModalOpen(true);
      closeMenus();
    }
  };

  return (
    <>
      <ChatOptions 
        isMenuOpen={true}
        isMobile={isMobile}
        closeMenus={closeMenus}
        openRenameModal={handleOpenRenameModal}
        openDeleteModal={handleOpenDeleteModal}
      />

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