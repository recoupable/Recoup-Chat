"use client";

import useConversations from "@/hooks/useConversations";
import React, { createContext, useContext, useMemo } from "react";

const ConversationsContext = createContext<ReturnType<typeof useConversations>>(
  {} as ReturnType<typeof useConversations>,
);

const ConversationsProvider = ({ children }: { children: React.ReactNode }) => {
  const conversations = useConversations();

  const value = useMemo(() => ({ ...conversations }), [conversations]);

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

const useConversationsProvider = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error(
      "useConversationsProvider must be used within a ConversationsProvider",
    );
  }
  return context;
};

export { ConversationsProvider, useConversationsProvider }; 