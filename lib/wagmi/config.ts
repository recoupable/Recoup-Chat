import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [miniAppConnector()],
});
