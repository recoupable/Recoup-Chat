"use client";

import ChatSkeleton from "@/components/Chat/ChatSkeleton";
import InitialChat from "@/components/Chat/InitialChat";
import { useChatProvider } from "@/providers/ChatProvider";
import { useFirstArtistRedirect } from "@/hooks/useFirstArtistRedirect";

const HomePage = () => {
  useFirstArtistRedirect();
  
  const { isLoading } = useChatProvider();
  if (isLoading) return <ChatSkeleton />;
  return <InitialChat />;
};

export default HomePage;
