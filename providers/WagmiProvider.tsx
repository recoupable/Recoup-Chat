import { WagmiProvider as WagmiProviderBase } from "wagmi";
import { config } from "@/lib/wagmi/config";

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiProviderBase config={config}>{children}</WagmiProviderBase>;
};

export default WagmiProvider;
