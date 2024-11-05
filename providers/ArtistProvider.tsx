"use client";

import useArtists from "@/hooks/useArtists";
import React, { createContext, useContext, useMemo } from "react";

const ArtistContext = createContext<ReturnType<typeof useArtists>>(
  {} as ReturnType<typeof useArtists>,
);

const ArtistProvider = ({ children }: { children: React.ReactNode }) => {
  const artists = useArtists();

  const value = useMemo(() => ({ ...artists }), [artists]);

  return (
    <ArtistContext.Provider value={value}>{children}</ArtistContext.Provider>
  );
};

const useArtistProvider = () => {
  const context = useContext(ArtistContext);
  if (!context) {
    throw new Error("useArtistProvider must be used within a ArtistProvider");
  }
  return context;
};

export { ArtistProvider, useArtistProvider };
