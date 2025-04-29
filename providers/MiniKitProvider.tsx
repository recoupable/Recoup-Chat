import { MiniKitProvider as MKProvider } from "@coinbase/onchainkit/minikit";
import { ReactNode } from "react";
import { base } from "viem/chains";

export function MiniKitProvider(props: { children: ReactNode }) {
  return (
    <MKProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "snake",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {props.children}
    </MKProvider>
  );
}
