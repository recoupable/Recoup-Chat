import { useChatProvider } from "@/providers/ChatProvider";
import { Message, useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolChat = (question?: string, context?: any, toolName?: any) => {
  const { finalCallback, clearQuery } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const [tiktokTrends, setTiktokTrends] = useState(null);
  const [pending, setPending] = useState(false);

  const {
    messages,
    append,
    isLoading: loading,
  } = useChat({
    api: "/api/tool_call",
    body: {
      question,
      context: {
        ...context,
        tiktokTrends,
      },
      toolName,
    },
    onError: console.error,
    onFinish: async (message) => {
      await finalCallback(
        message,
        {
          id: uuidV4(),
          content: question as string,
          role: "user",
        },
        conversationId as string,
      );
      await clearQuery();
    },
  });

  const answer = messages.filter(
    (message: Message) => message.role === "assistant",
  )?.[0]?.content;

  return {
    messages,
    append,
    loading: loading || pending,
    setTiktokTrends,
    setPending,
    answer,
    tiktokTrends,
  };
};

export default useToolChat;
