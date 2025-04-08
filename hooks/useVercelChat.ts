import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import createMemory from "@/lib/createMemory";
import { usePendingMessages } from "./usePendingMessages";
import { useMessageLoader } from "./useMessageLoader";
import useRoomCreation from "./useRoomCreation";

interface UseVercelChatProps {
  roomId?: string;
  userId?: string;
  artistId?: string;
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, useRoomCreation, usePendingMessages, and useMessageLoader
 */
export function useVercelChat({
  roomId,
  userId,
  artistId,
}: UseVercelChatProps) {
  // Room creation functionality
  const { roomId: internalRoomId, createNewRoom } = useRoomCreation({
    initialRoomId: roomId,
    userId,
    artistId,
  });

  // Message tracking for pending messages
  const { trackMessage } = usePendingMessages(internalRoomId);

  // Chat functionality from AI SDK
  const { messages, append, status, stop, setMessages } = useChat({
    id: "recoup-chat", // Constant ID prevents state reset when route changes
    api: `/api/chat/vercel`,
    body: {
      roomId: internalRoomId,
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

  // Message loading functionality
  const { isLoading, hasError } = useMessageLoader(
    internalRoomId,
    userId,
    setMessages
  );

  // Derived state
  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  // Handler for sending messages
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
      createNewRoom(content);
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
