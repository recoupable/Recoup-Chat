import { Message, useChat } from "@ai-sdk/react";
import { useMessageLoader } from "./useMessageLoader";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import getEarliestFailedUserMessageId from "@/lib/messages/getEarliestFailedUserMessageId";
import { clientDeleteTrailingMessages } from "@/lib/messages/clientDeleteTrailingMessages";
import { generateUUID } from "@/lib/generateUUID";
import { usePrivy } from "@privy-io/react-auth";
import { useConversationsProvider } from "@/providers/ConversationsProvider";

interface UseVercelChatProps {
  id: string;
  initialMessages?: Message[];
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({ id, initialMessages }: UseVercelChatProps) {
  const { authenticated } = usePrivy();
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { roomId } = useParams();
  const userId = userData?.id;
  const artistId = selectedArtist?.account_id;
  const [hasChatApiError, setHasChatApiError] = useState(false);
  const messagesLengthRef = useRef<number>();
  const { fetchConversations } = useConversationsProvider();

  const {
    messages,
    handleSubmit,
    input,
    status,
    stop,
    setMessages,
    setInput,
    reload,
    append,
  } = useChat({
    id,
    body: {
      roomId: id,
      artistId,
      accountId: userId,
      email: userData?.email,
    },
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onError: (e) => {
      console.error("An error occurred, please try again!", e);
      toast.error("An error occurred, please try again!");
      setHasChatApiError(true);
    },
    onFinish: () => {
      // As onFinish triggers when a message is streamed successfully.
      // On a new chat, usually there are 2 messages:
      // 1. First user message
      // 2. Second just streamed message
      // When messages length is 2, it means second message has been streamed successfully and should also have been updated on backend
      // So we trigger the fetchConversations to update the conversation list
      
      if (messagesLengthRef.current === 2) {
        fetchConversations()
      }
    }
  });

  // Keep messagesRef in sync with messages
  messagesLengthRef.current = messages.length;

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

  const deleteTrailingMessages = async () => {
    const earliestFailedUserMessageId =
      getEarliestFailedUserMessageId(messages);
    if (earliestFailedUserMessageId) {
      const successfulDeletion = await clientDeleteTrailingMessages({
        id: earliestFailedUserMessageId,
      });
      if (successfulDeletion) {
        setMessages((messages) => {
          const index = messages.findIndex(
            (m) => m.id === earliestFailedUserMessageId
          );
          if (index !== -1) {
            return [...messages.slice(0, index)];
          }

          return messages;
        });
      }
    }

    setHasChatApiError(false);
  };

  const silentlyUpdateUrl = () => {
    window.history.replaceState({}, "", `/chat/${id}`);
  };

  const handleSendMessage = async () => {
    if (hasChatApiError) {
      await deleteTrailingMessages();
    }
    // Always append message first for immediate feedback
    handleSubmit(undefined);

    if (!roomId) {
      silentlyUpdateUrl();
    }
  };

  const handleSendQueryMessages = async (initialMessage: Message) => {
    silentlyUpdateUrl();
    append(initialMessage);
  };

  useEffect(() => {
    const isFullyLoggedIn = authenticated && artistId && userId;
    const isReady = status === "ready";
    const hasMessages = messages.length > 1;
    const hasInitialMessages = initialMessages && initialMessages.length > 0;
    if (!hasInitialMessages || !isReady || hasMessages || !isFullyLoggedIn)
      return;
    handleSendQueryMessages(initialMessages[0]);
  }, [initialMessages, status, authenticated, artistId, userId]);

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
    setMessages,
    stop,
    reload,
    append,
  };
}
