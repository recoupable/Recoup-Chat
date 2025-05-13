import React, { createContext, useContext, ReactNode } from "react";
import { useVercelChat } from "@/hooks/useVercelChat";
import { Message, UseChatHelpers } from "@ai-sdk/react";
import useAttachments from "@/hooks/useAttachments";
import { Attachment } from "@ai-sdk/ui-utils";

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
  setAttachments: (attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
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
    reload,
    append,
  } = useVercelChat({ 
    id: chatId, 
    initialMessages,
    uploadedAttachments // Pass attachments to useVercelChat
  });
  
  // When a message is sent successfully, clear the attachments
  const handleSendMessageWithClear = async (event: React.FormEvent<HTMLFormElement>) => {
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
