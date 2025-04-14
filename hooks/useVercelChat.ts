import { useChat } from "@ai-sdk/react";
import { useMessageLoader } from "./useMessageLoader";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";

interface UseVercelChatProps {
  id: string;
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({ id }: UseVercelChatProps) {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { roomId } = useParams();

  const userId = userData?.id;
  const artistId = selectedArtist?.account_id;

  const { messages, handleSubmit, input, status, stop, setMessages, setInput } =
    useChat({
      id,
      api: `/api/chat/vercel`,
      body: {
        roomId: id,
        artistId,
        accountId: userId,
        email: userData?.email,
      },
      onError: (e) => {
        console.error("An error occurred, please try again!", e);
      },
    });

  const { isLoading: isMessagesLoading, hasError } = useMessageLoader(
    messages.length === 0 ? id : undefined,
    userId,
    setMessages
  );

  // Only show loading state if:
  // 1. We're loading messages
  // 2. We have a roomId (meaning we're intentionally loading a chat)
  // 3. We don't already have messages (important for redirects)
  const isLoading = isMessagesLoading && !!id && messages.length === 0;

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const handleSendMessage = () => {
    // Always append message first for immediate feedback
    handleSubmit(undefined);

    if (!roomId) {
      // Silently update the URL without affecting the UI or causing remount
      window.history.replaceState({}, "", `/instant/${id}`);
    }
  };

  return {
    // States
    messages,
    status,
    input,
    isLoading,
    hasError,
    isGeneratingResponse,

    // Actions
    handleSendMessage,
    setInput,
    stop,
  };
}
