"use client";

import ChatSkeleton from "@/components/Chat/ChatSkeleton";
import InitialChat from "@/components/Chat/InitialChat";
import { useChatProvider } from "@/providers/ChatProvider";
import { useFirstArtistRedirect } from "@/hooks/useFirstArtistRedirect";
import useAutoLogin from "@/hooks/useAutoLogin";

const HomePage = () => {
  useFirstArtistRedirect();
  useAutoLogin();
  const { isLoading } = useChatProvider();
  
  if (isLoading) return <ChatSkeleton />;
  return <InitialChat />;
};

export default HomePage;
