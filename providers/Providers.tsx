"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "./ChatProvider";
import PrivyProvider from "./PrivyProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider>
      <ChatProvider>{children}</ChatProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default Providers;
