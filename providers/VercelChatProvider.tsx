import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useVercelChat } from "@/hooks/useVercelChat";
import { Message, UseChatHelpers } from "@ai-sdk/react";
import useAttachments from "@/hooks/useAttachments";
import { Attachment } from "@ai-sdk/ui-utils";
import { useArtistProvider } from "./ArtistProvider";
import { generateUUID } from "@/lib/generateUUID";

// Interface for the context data
interface VercelChatContextType {
  id: string | undefined;
  messages: UseChatHelpers["messages"];
  status: UseChatHelpers["status"];
  isLoading: boolean;
  hasError: boolean;
  isGeneratingResponse: boolean;
  handleSendMessage: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  stop: UseChatHelpers["stop"];
  setInput: UseChatHelpers["setInput"];
  input: UseChatHelpers["input"];
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  append: UseChatHelpers["append"];
  attachments: Attachment[];
  pendingAttachments: Attachment[];
  uploadedAttachments: Attachment[];
  setAttachments: (
    attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])
  ) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  hasPendingUploads: boolean;
}

// Create the context
const VercelChatContext = createContext<VercelChatContextType | undefined>(
  undefined
);

// Props for the provider component
interface VercelChatProviderProps {
  children: ReactNode;
  chatId: string;
  initialMessages?: Message[];
}

/**
 * Provider component that wraps its children with the VercelChat context
 */
export function VercelChatProvider({
  children,
  chatId,
  initialMessages,
}: VercelChatProviderProps) {
  // Use the useAttachments hook to get attachment state and functions
  const {
    attachments,
    pendingAttachments,
    uploadedAttachments,
    setAttachments,
    removeAttachment,
    clearAttachments,
    hasPendingUploads,
  } = useAttachments();
  const { updateChatState } = useArtistProvider();

  // Use the useVercelChat hook to get the chat state and functions
  const {
    messages,
    status,
    isLoading,
    hasError,
    isGeneratingResponse,
    handleSendMessage,
    stop,
    setInput,
    input,
    setMessages,
    reload: originalReload,
    append,
  } = useVercelChat({
    id: chatId,
    initialMessages,
    uploadedAttachments, // Pass attachments to useVercelChat
  });

  const reload = useCallback(() => {
    return originalReload();
  }, [originalReload]);

  // When a message is sent successfully, clear the attachments
  const handleSendMessageWithClear = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    await handleSendMessage(event);

    // Clear attachments after sending
    clearAttachments();
  };

  // Create the context value object
  const contextValue: VercelChatContextType = {
    id: chatId,
    messages,
    status,
    isLoading,
    hasError,
    isGeneratingResponse,
    handleSendMessage: handleSendMessageWithClear,
    stop,
    setInput,
    input,
    setMessages,
    reload,
    append,
    attachments,
    pendingAttachments,
    uploadedAttachments,
    setAttachments,
    removeAttachment,
    clearAttachments,
    hasPendingUploads,
  };

  // Handle YouTube OAuth continuation
  const hasProcessedOAuth = useRef(false);
  
  useEffect(() => {
    console.log('🔍 YouTube OAuth useEffect triggered');
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
      console.log('ℹ️  No YouTube OAuth parameters found in URL');
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

  // Send chat status and messages to ArtistProvider
  useEffect(() => {
    updateChatState(status, messages);
  }, [status, messages, updateChatState]);

  // Provide the context value to children
  return (
    <VercelChatContext.Provider value={contextValue}>
      {children}
    </VercelChatContext.Provider>
  );
}

/**
 * Custom hook to use the VercelChat context
 */
export function useVercelChatContext() {
  const context = useContext(VercelChatContext);

  if (context === undefined) {
    throw new Error(
      "useVercelChatContext must be used within a VercelChatProvider"
    );
  }

  return context;
}
