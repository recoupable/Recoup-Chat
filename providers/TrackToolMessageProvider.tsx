"use client";

import useTrackToolMessages from "@/hooks/useTrackToolMessages";
import React, { createContext, useContext } from "react";

const TrackToolMessageContext = createContext<undefined>(undefined);

const TrackToolMessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useTrackToolMessages();
  return (
    <TrackToolMessageContext.Provider value={undefined}>
      {children}
    </TrackToolMessageContext.Provider>
  );
};

const useTrackToolMessageProvider = () => {
  const context = useContext(TrackToolMessageContext);
  if (!context) {
    throw new Error(
      "useTrackToolMessageProvider must be used within a TrackToolMessageProvider",
    );
  }
  return context;
};

export { TrackToolMessageProvider, useTrackToolMessageProvider };
