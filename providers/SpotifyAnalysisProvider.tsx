"use client";

import useSpotifyAnalysis from "@/hooks/useSpotifyAnalysis";
import React, { createContext, useContext, useMemo } from "react";

const SpotifyAnalysisContext = createContext<
  ReturnType<typeof useSpotifyAnalysis>
>({} as ReturnType<typeof useSpotifyAnalysis>);

const SpotifyAnalysisProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const spotifyAnalysis = useSpotifyAnalysis();

  const value = useMemo(() => ({ ...spotifyAnalysis }), [spotifyAnalysis]);

  return (
    <SpotifyAnalysisContext.Provider value={value}>
      {children}
    </SpotifyAnalysisContext.Provider>
  );
};

const useSpotifyAnalysisProvider = () => {
  const context = useContext(SpotifyAnalysisContext);
  if (!context) {
    throw new Error(
      "useSpotifyAnalysisProvider must be used within a SpotifyAnalysisProvider",
    );
  }
  return context;
};

export { SpotifyAnalysisProvider, useSpotifyAnalysisProvider };
