"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Chat } from "../VercelChat/chat";
import { useEffect } from "react";
import { Message } from "ai";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { Loader } from "lucide-react";

const HomePage = ({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) => {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { isLoading } = useArtistProvider();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return isLoading ? (
    <div className="flex size-full items-center justify-center">
      <Loader className="size-5 text-grey-dark-1 animate-spin" />
    </div>
  ) : (
    <div className="flex flex-col size-full items-center">
      <Chat id={id} initialMessages={initialMessages} />
    </div>
  );
};

export default HomePage;
