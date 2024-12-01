"use client";

import useChat from "@/hooks/useChat";
import React, { createContext, useContext, useMemo } from "react";

const ChatContext = createContext<ReturnType<typeof useChat>>(
  {} as ReturnType<typeof useChat>,
);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chat = useChat();

  const value = useMemo(() => ({ ...chat }), [chat]);

  return (
    <ChatContext.Provider value={value}>
      <title>{chat.title}</title>
      {children}
    </ChatContext.Provider>
  );
};

const useChatProvider = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatProvider must be used within a ChatProvider");
  }
  return context;
};

export { ChatProvider, useChatProvider };
