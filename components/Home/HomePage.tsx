"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Chat } from "../VercelChat/chat";
import { useEffect } from "react";
import { Message } from "ai";
import MiniAppAddress from "./MiniAppAddress";
import { useMiniAppContext } from "@/providers/MiniAppProvider";

const HomePage = ({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) => {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { isMiniApp } = useMiniAppContext();
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={id} initialMessages={initialMessages} />
      {isMiniApp && <MiniAppAddress />}
    </div>
  );
};

export default HomePage;
