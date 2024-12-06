"use client";

import useStripe from "@/hooks/useStripe";
import React, { createContext, useContext, useMemo } from "react";

const StripeContext = createContext<ReturnType<typeof useStripe>>(
  {} as ReturnType<typeof useStripe>,
);

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  const stripe = useStripe();

  const value = useMemo(() => ({ ...stripe }), [stripe]);

  return (
    <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
  );
};

const useStripeProvider = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripeProvider must be used within a StripeProvider");
  }
  return context;
};

export { StripeProvider, useStripeProvider };
