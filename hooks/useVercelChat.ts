import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import createMemory from "@/lib/createMemory";
import { useMessageLoader } from "./useMessageLoader";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";

interface UseVercelChatProps {
  id: string;
  initialMessages?: Message[];
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, useRoomCreation, usePendingMessages, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({
  id,
  initialMessages = [],
}: UseVercelChatProps) {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { roomId } = useParams();

  const userId = userData?.id;
  const artistId = selectedArtist?.account_id;

  const { messages, append, status, stop, setMessages, input, setInput } =
    useChat({
      id,
      initialMessages,
      api: `/api/chat/vercel`,
      body: {
        roomId: id,
        artistId,
        accountId: userId,
      },
      onFinish: (message) => {
        if (id) {
          // If room exists, immediately store the message
          createMemory(message, id);
        }
      },
      onError: () => {
        console.error("An error occurred, please try again!");
      },
    });

  // Only use the message loader if we don't have initial messages
  const { isLoading: isMessagesLoading, hasError } = useMessageLoader(
    initialMessages.length === 0 && messages.length === 0 ? id : undefined,
    userId,
    setMessages
  );

  // Only show loading state if:
  // 1. We're loading messages
  // 2. We have a roomId (meaning we're intentionally loading a chat)
  // 3. We don't already have messages (important for redirects)
  // 4. We don't have initial messages
  const isLoading =
    isMessagesLoading &&
    !!id &&
    messages.length === 0 &&
    initialMessages.length === 0;

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

    if (!roomId) {
      // Silently update the URL without affecting the UI or causing remount
      window.history.replaceState({}, "", `/instant/${id}`);
    }
  };

  return {
    // States
    messages,
    status,
    isLoading,
    hasError,
    isGeneratingResponse,
    input,

    // Actions
    handleSendMessage,
    setInput,
    stop,
  };
}
