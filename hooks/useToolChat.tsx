import { useChatProvider } from "@/providers/ChatProvider";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

const useToolChat = (question?: string, context?: any) => {
  const { finalCallback, clearQuery } = useChatProvider();
  const { conversation: conversationId } = useParams();

  const {
    messages,
    append,
    isLoading: loading,
  } = useChat({
    api: "/api/tool_call",
    body: {
      question,
      context,
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

  return {
    messages,
    append,
    loading,
  };
};

export default useToolChat;
