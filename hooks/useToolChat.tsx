import { useChatProvider } from "@/providers/ChatProvider";
import { Message, useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolChat = (question?: string, context?: any, toolName?: any) => {
  const { finalCallback, clearQuery } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const [tiktokTrends, setTiktokTrends] = useState<any>(null);
  const [isSearchingTrends, setIsSearchingTrends] = useState(false);
  const toolCallContext = {
    ...(context !== null && { context }),
    ...(tiktokTrends !== null && { trends: tiktokTrends }),
  };
  const [beginCall, setBeginCall] = useState(false);

  const {
    messages,
    append,
    isLoading: loading,
  } = useChat({
    api: "/api/tool_call",
    body: {
      question,
      context: toolCallContext,
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

  useEffect(() => {
    const init = async () => {
      await append({
        id: uuidV4(),
        content: question as string,
        role: "user",
      });
      setBeginCall(false);
    };
    if (!beginCall || !question) return;
    init();
  }, [beginCall, question]);

  return {
    messages,
    append,
    loading: loading || isSearchingTrends,
    isSearchingTrends,
    setTiktokTrends,
    setIsSearchingTrends,
    answer,
    tiktokTrends,
    setBeginCall,
  };
};

export default useToolChat;
