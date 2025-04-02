import { useState } from "react";
import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import RecentChatSkeleton from "./RecentChatSkeleton";
import capitalize from "@/lib/capitalize";
import ChatOptionsMenu from "../Chat/ChatOptionsMenu";
import { Conversation } from "@/types/Chat";
import { useParams } from "next/navigation";

/**
 * A component that displays and manages the list of recent chat conversations
 * for the currently selected artist. Includes inline rename and delete functionality.
 */
const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading, fetchConversations } = useConversationsProvider();
  const { handleClick } = useClickChat();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const params = useParams();
  const currentChatId = params?.id as string | undefined;
  
  /**
   * Starts the inline renaming process for a chat
   */
  const startRenaming = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setEditedName(currentName);
  };
  
  /**
   * Cancels the rename operation and resets the editing state
   */
  const cancelRenaming = () => {
    setEditingChatId(null);
    setEditedName("");
  };

  /**
   * Handles keyboard events during renaming (Enter to save, Escape to cancel)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, chatId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRename(chatId, editedName);
    } else if (e.key === "Escape") {
      cancelRenaming();
    }
  };

  /**
   * Updates the chat name in the database and refreshes the conversation list
   */
  const saveRename = async (chatId: string, newName: string): Promise<void> => {
    if (!newName.trim()) {
      cancelRenaming();
      return;
    }
    
    try {
      const response = await fetch(
        `/api/room/update?room_id=${encodeURIComponent(chatId)}&topic=${encodeURIComponent(newName)}`
      );
      
      if (response.ok) {
        fetchConversations();
        cancelRenaming();
      } else {
        console.error("Failed to rename chat:", await response.json());
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  /**
   * Deletes a chat from the database and refreshes the conversation list
   */
  const handleDelete = async (chatId: string): Promise<void> => {
    try {
      const response = await fetch(
        `/api/room/delete?room_id=${encodeURIComponent(chatId)}`
      );
      
      if (response.ok) {
        fetchConversations();
      } else {
        console.error("Failed to delete chat:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="h-[1px] bg-grey-light w-full mt-1 mb-2 md:mt-2 md:mb-3" />
      <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark md:px-4">
        Recent Chats
      </p>
      <div className="relative">
        <div className="max-h-[350px] overflow-y-auto space-y-0.5 md:space-y-1 md:px-4">
          {isLoading ? (
            <RecentChatSkeleton />
          ) : (
            <>
              {conversations.map((conversation, index) => {
                const conv = conversation as Conversation;
                const chatName = conv.topic || `${capitalize(conv.artist_id || '')} Analysis`;
                const isEditing = editingChatId === conv.id;
                const isActive = currentChatId === conv.id;
                
                return (
                  <div
                    className={`flex gap-2 items-center w-full group relative rounded-md px-2 py-1 transition-colors ${
                      isActive 
                        ? 'bg-grey-light-1' 
                        : 'hover:bg-grey-light-1'
                    }`}
                    key={conv.id || index}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, conv.id)}
                        onBlur={() => saveRename(conv.id, editedName)}
                        className="text-sm px-2 py-1 border rounded-md w-full max-w-[160px] focus:outline-none"
                        autoFocus
                        aria-label="Edit chat name"
                      />
                    ) : (
                      <button
                        type="button"
                        className="flex items-center w-full text-left"
                        onClick={() => handleClick(conv, toggleModal)}
                      >
                        <p className={`text-sm truncate max-w-[160px] ${isActive ? 'font-medium' : ''}`}>
                          {chatName}
                        </p>
                      </button>
                    )}
                    
                    {!isEditing && (
                      <div className="ml-auto">
                        <ChatOptionsMenu
                          chatId={conv.id}
                          onStartRename={() => startRenaming(conv.id, chatName)}
                          onDelete={handleDelete}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
        
        {/* Fade effect overlays - more subtle */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10"></div>
      </div>
    </div>
  );
};

export default RecentChats;
