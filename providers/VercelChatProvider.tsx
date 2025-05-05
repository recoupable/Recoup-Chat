import React, { createContext, useContext, ReactNode } from "react";
import { useVercelChat } from "@/hooks/useVercelChat";
import { UseChatHelpers } from "@ai-sdk/react";

// Interface for the context data
interface VercelChatContextType {
  id: string | undefined;
  messages: UseChatHelpers["messages"];
  status: UseChatHelpers["status"];
  isLoading: boolean;
  hasError: boolean;
  isGeneratingResponse: boolean;
  handleSendMessage: () => Promise<void>;
  stop: UseChatHelpers["stop"];
  setInput: UseChatHelpers["setInput"];
  input: UseChatHelpers["input"];
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
}

// Create the context
const VercelChatContext = createContext<VercelChatContextType | undefined>(
  undefined
);

// Props for the provider component
interface VercelChatProviderProps {
  children: ReactNode;
  chatId: string;
}

/**
 * Provider component that wraps its children with the VercelChat context
 */
export function VercelChatProvider({
  children,
  chatId,
}: VercelChatProviderProps) {
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
  } = useVercelChat({ id: chatId });

  // Create the context value object
  const contextValue: VercelChatContextType = {
    id: chatId,
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
