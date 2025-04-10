import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import createMemory from "@/lib/createMemory";
import { usePendingMessages } from "./usePendingMessages";
import { useMessageLoader } from "./useMessageLoader";
import useRoomCreation from "./useRoomCreation";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

interface UseVercelChatProps {
  roomId?: string;
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, useRoomCreation, usePendingMessages, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({ roomId }: UseVercelChatProps) {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();

  const userId = userData?.id;
  const artistId = selectedArtist?.account_id;

  const { roomId: internalRoomId, createNewRoom } = useRoomCreation({
    initialRoomId: roomId,
    userId,
    artistId,
  });
  const { trackMessage } = usePendingMessages(internalRoomId);

  // Use roomId for existing chats, chatId for new chats, or fallback to a constant
  const chatIdToUse = roomId || "recoup-chat";

  const { messages, append, status, stop, setMessages } = useChat({
    id: chatIdToUse, // Use the dynamic chat ID
    api: `/api/chat/vercel`,
    body: {
      roomId: internalRoomId,
      artistId,
    },
    onFinish: (message) => {
      if (internalRoomId) {
        // If room exists, immediately store the message
        createMemory(message, internalRoomId);
      } else {
        // Otherwise, add to pending messages
        trackMessage(message as Message);
      }
    },
    onError: () => {
      console.error("An error occurred, please try again!");
    },
  });

  const { isLoading: isMessagesLoading, hasError } = useMessageLoader(
    messages.length === 0 ? internalRoomId : undefined,
    userId,
    setMessages
  );

  // Only show loading state if:
  // 1. We're loading messages
  // 2. We have a roomId (meaning we're intentionally loading a chat)
  // 3. We don't already have messages (important for redirects)
  const isLoading = isMessagesLoading && !!roomId && messages.length === 0;

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    };

    // Always append message first for immediate feedback
    append(message);

    if (!internalRoomId) {
      trackMessage(message);
      // Pass the chatId to createNewRoom to use as the room ID
      createNewRoom(content, roomId);
    }
  };

  return {
    // States
    messages,
    status,
    isLoading,
    hasError,
    internalRoomId,
    isGeneratingResponse,

    // Actions
    handleSendMessage,
    stop,
  };
}
