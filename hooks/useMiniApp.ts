import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export interface MiniApp {
  isMiniApp: boolean;
}

export const useMiniApp = (): MiniApp => {
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    sdk.isInMiniApp().then(setIsMiniApp);
  }, []);

  return { isMiniApp };
};
