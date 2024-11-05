"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "./ChatProvider";
import PrivyProvider from "./PrivyProvider";
import { UserProvider } from "./UserProvder";
import { ThemeProvider } from "next-themes";
import { ArtistProvider } from "./ArtistProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class">
      <PrivyProvider>
        <UserProvider>
          <ArtistProvider>
            <ChatProvider>{children}</ChatProvider>
          </ArtistProvider>
        </UserProvider>
      </PrivyProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default Providers;
