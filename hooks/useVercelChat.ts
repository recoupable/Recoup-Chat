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
import { Attachment } from "@ai-sdk/ui-utils";

interface UseVercelChatProps {
  id: string;
  initialMessages?: Message[];
  uploadedAttachments?: Attachment[]; // Accept attachments from provider
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({
  id,
  initialMessages,
  uploadedAttachments = [], // Default to empty array
}: UseVercelChatProps) {
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
        fetchConversations();
      }
    },
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

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasChatApiError) {
      await deleteTrailingMessages();
    }

    // Only send successfully uploaded attachments
    const messageOptions =
      uploadedAttachments.length > 0
        ? { experimental_attachments: uploadedAttachments }
        : undefined;

    // Submit the message
    handleSubmit(event, messageOptions);

    if (!roomId) {
      silentlyUpdateUrl();
    }
  };

  const handleSendQueryMessages = async (initialMessage: Message) => {
    silentlyUpdateUrl();
    append(initialMessage);
  };

  useEffect(() => {
    const isFullyLoggedIn = userId;
    const isReady = status === "ready";
    const hasMessages = messages.length > 1;
    const hasInitialMessages = initialMessages && initialMessages.length > 0;
    if (!hasInitialMessages || !isReady || hasMessages || !isFullyLoggedIn)
      return;
    handleSendQueryMessages(initialMessages[0]);
  }, [initialMessages, status, userId]);

  // Handle YouTube OAuth continuation
  const hasProcessedOAuth = useRef(false);
  
  useEffect(() => {
    console.log('🔍 YouTube OAuth useEffect triggered in useVercelChat');
    console.log('📊 Debug info:', {
      hasProcessedOAuth: hasProcessedOAuth.current,
      messagesLength: messages.length,
      windowDefined: typeof window !== 'undefined',
      currentURL: typeof window !== 'undefined' ? window.location.href : 'N/A',
      search: typeof window !== 'undefined' ? window.location.search : 'N/A'
    });

    // Only process once and only if we have messages (meaning this is an existing conversation)
    if (hasProcessedOAuth.current) {
      console.log('❌ Already processed OAuth, skipping');
      return;
    }
    
    if (messages.length === 0) {
      console.log('❌ No messages yet, waiting for conversation to load');
      return;
    }
    
    if (typeof window === 'undefined') {
      console.log('❌ Window undefined (SSR), skipping');
      return;
    }

    console.log('✅ All conditions met, checking for OAuth parameters');

    // Check for YouTube OAuth parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const youtubeAuth = urlParams.get('youtube_auth');
    const youtubeAuthError = urlParams.get('youtube_auth_error');
    
    console.log('🔗 URL parameters:', {
      youtubeAuth,
      youtubeAuthError,
      allParams: Object.fromEntries(urlParams.entries())
    });

    let messageToAppend: { id: string; role: "user"; content: string } | null = null;

    // Handle successful YouTube authentication
    if (youtubeAuth === 'success') {
      console.log('🎉 Found youtube_auth=success, preparing success message');
      messageToAppend = {
        id: generateUUID(),
        role: "user",
        content: "Great! I've successfully connected my YouTube account. Please continue with what you were helping me with.",
      };
    }
    // Handle YouTube authentication error
    else if (youtubeAuthError) {
      console.log('❗ Found youtube_auth_error, preparing error message');
      const errorMessage = decodeURIComponent(youtubeAuthError);
      messageToAppend = {
        id: generateUUID(),
        role: "user",
        content: `I encountered an issue while connecting my YouTube account: ${errorMessage}. Can you help me try connecting again?`,
      };
    } else {
      console.log('ℹ️ No YouTube OAuth parameters found in URL');
    }

    // Append the message if we have one
    if (messageToAppend) {
      console.log('📝 Appending OAuth continuation message:', messageToAppend);
      hasProcessedOAuth.current = true;
      
      try {
        append(messageToAppend);
        console.log('✅ Successfully appended message');
      } catch (error) {
        console.error('❌ Error appending message:', error);
      }

      // Clean up URL parameters
      console.log('🧹 Cleaning up URL parameters');
      urlParams.delete('youtube_auth');
      urlParams.delete('youtube_auth_error');
      
      const cleanUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      console.log('🔗 New clean URL:', cleanUrl);
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [append, messages.length]);

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
