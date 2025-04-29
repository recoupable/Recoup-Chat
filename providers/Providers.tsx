"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "./ChatProvider";
import PrivyProvider from "./PrivyProvider";
import { UserProvider } from "./UserProvder";
import { ArtistProvider } from "./ArtistProvider";
import { ConversationsProvider } from "./ConversationsProvider";
import { FunnelReportProvider } from "./FunnelReportProvider";
import { PaymentProvider } from "./PaymentProvider";
import { MessagesProvider } from "./MessagesProvider";
import { PromptsProvider } from "./PromptsProvider";
import { FunnelAnalysisProvider } from "./FunnelAnalysisProvider";
import { SidebarExpansionProvider } from "./SidebarExpansionContext";
import { MiniKitProvider } from "./MiniKitProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider>
      <MiniKitProvider>
        <UserProvider>
          <FunnelReportProvider>
            <ArtistProvider>
              <SidebarExpansionProvider>
                <ConversationsProvider>
                  <PromptsProvider>
                    <MessagesProvider>
                      <ChatProvider>
                        <PaymentProvider>
                          <FunnelAnalysisProvider>
                            {children}
                          </FunnelAnalysisProvider>
                        </PaymentProvider>
                      </ChatProvider>
                    </MessagesProvider>
                  </PromptsProvider>
                </ConversationsProvider>
              </SidebarExpansionProvider>
            </ArtistProvider>
          </FunnelReportProvider>
        </UserProvider>
      </MiniKitProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default Providers;
