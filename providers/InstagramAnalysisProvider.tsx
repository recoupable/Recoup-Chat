"use client";

import useInstagramAnalysis from "@/hooks/useInstagramAnalysis";
import React, { createContext, useContext, useMemo } from "react";

const InstagramAnalysisContext = createContext<
  ReturnType<typeof useInstagramAnalysis>
>({} as ReturnType<typeof useInstagramAnalysis>);

const InstagramAnalysisProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const instagramAnalysis = useInstagramAnalysis();

  const value = useMemo(() => ({ ...instagramAnalysis }), [instagramAnalysis]);

  return (
    <InstagramAnalysisContext.Provider value={value}>
      {children}
    </InstagramAnalysisContext.Provider>
  );
};

const useInstagramAnalysisProvider = () => {
  const context = useContext(InstagramAnalysisContext);
  if (!context) {
    throw new Error(
      "useInstagramAnalysisProvider must be used within a InstagramAnalysisProvider",
    );
  }
  return context;
};

export { InstagramAnalysisProvider, useInstagramAnalysisProvider };
