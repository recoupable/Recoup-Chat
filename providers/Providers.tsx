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
import WagmiProvider from "./WagmiProvider";
import { MiniAppProvider } from "./MiniAppProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider>
    <QueryClientProvider client={queryClient}>
      <PrivyProvider>
        <MiniKitProvider>
          <MiniAppProvider>
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
          </MiniAppProvider>
        </MiniKitProvider>
      </PrivyProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default Providers;
