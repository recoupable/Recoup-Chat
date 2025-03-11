"use client";

import ChatSkeleton from "@/components/Chat/ChatSkeleton";
import InitialChat from "@/components/Chat/InitialChat";
import ArtistSyncForChat from "@/components/Chat/ArtistSyncForChat";
import { useChatProvider } from "@/providers/ChatProvider";
import { useFirstArtistRedirect } from "@/hooks/useFirstArtistRedirect";

const HomePage = () => {
  useFirstArtistRedirect();
  
  const { isLoading } = useChatProvider();
  
  if (isLoading) return <ChatSkeleton />;
  
  return (
    <>
      <ArtistSyncForChat />
      <InitialChat />
    </>
  );
};

export default HomePage;
