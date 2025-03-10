"use client";

import ChatSkeleton from "@/components/Chat/ChatSkeleton";
import InitialChat from "@/components/Chat/InitialChat";
import { useChatProvider } from "@/providers/ChatProvider";
import { useFirstArtistRedirect } from "@/hooks/useFirstArtistRedirect";

const HomePage = () => {
  // Keep the artist redirect functionality from the original home page
  useFirstArtistRedirect();
  
  // New chat content
  const { isLoading } = useChatProvider();
  if (isLoading) return <ChatSkeleton />;
  return <InitialChat />;
};

export default HomePage;
