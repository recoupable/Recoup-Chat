"use client";

import ChatSkeleton from "@/components/Chat/ChatSkeleton";
import InitialChat from "@/components/Chat/InitialChat";
import { useChatProvider } from "@/providers/ChatProvider";

const NewChatPage = () => {
  const { isLoading } = useChatProvider();
  if (isLoading) return <ChatSkeleton />;
  return <InitialChat />;
};

export default NewChatPage;
