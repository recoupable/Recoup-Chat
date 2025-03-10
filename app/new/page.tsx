"use client";

import ChatSkeleton from "@/components/Chat/ChatSkeleton";
import InitialChat from "@/components/Chat/InitialChat";
import ArtistSyncForChat from "@/components/Chat/ArtistSyncForChat";
import { useChatProvider } from "@/providers/ChatProvider";

const NewChatPage = () => {
  const { isLoading } = useChatProvider();
  
  if (isLoading) return <ChatSkeleton />;
  
  return (
    <>
      <ArtistSyncForChat />
      <InitialChat />
    </>
  );
};

export default NewChatPage;
