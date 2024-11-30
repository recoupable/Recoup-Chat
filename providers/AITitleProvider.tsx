"use client";

import useAITitle from "@/hooks/useAITitle";
import React, { createContext, useContext, useMemo } from "react";

const AITitleContext = createContext<ReturnType<typeof useAITitle>>(
  {} as ReturnType<typeof useAITitle>,
);

const AITitleProvider = ({ children }: { children: React.ReactNode }) => {
  const aiTitle = useAITitle();

  const value = useMemo(() => ({ ...aiTitle }), [aiTitle]);

  return (
    <AITitleContext.Provider value={value}>
      <title>{aiTitle.title}</title>
      {children}
    </AITitleContext.Provider>
  );
};

const useAITitleProvider = () => {
  const context = useContext(AITitleContext);
  if (!context) {
    throw new Error("useAITitleProvider must be used within a AITitleProvider");
  }
  return context;
};

export { AITitleProvider, useAITitleProvider };
