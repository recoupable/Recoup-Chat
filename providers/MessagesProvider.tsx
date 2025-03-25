"use client";

import useMessages from "@/hooks/useMessages";
import React, { createContext, useContext, useMemo } from "react";
import { ChatMessage } from "@/types/reasoning";

interface MessagesContextType {
  messages: ChatMessage[];
  pending: boolean;
  isLoading: boolean;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleAiChatSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  appendAiChat: (message: ChatMessage) => void;
  reloadAiChat: () => void;
}

const MessagesContext = createContext<MessagesContextType>(
  {} as MessagesContextType
);

export const MessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const messages = useMessages();
  const value = useMemo(
    () => ({ ...messages }),
    [messages]
  ) as MessagesContextType;

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesProvider = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error(
      "useMessagesProvider must be used within a MessagesProvider"
    );
  }
  return context;
};
