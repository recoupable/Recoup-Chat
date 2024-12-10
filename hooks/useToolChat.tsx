import { useChatProvider } from "@/providers/ChatProvider";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";
import { Tools } from "@/types/Tool";
import { Message, useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolChat = (question?: string, toolName?: any) => {
  const { finalCallback, clearQuery } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const { tiktokNextSteps, tiktokRawReportContent } = useTikTokReportProvider();
  const {
    tiktokTrends,
    tiktokVideos,
    tiktokAnalysis,
    initReport,
    isSearchingTrends,
  } = useTikTokReportProvider();

  const toolCallContext = {
    ...(tiktokTrends !== null && { ...tiktokTrends }),
    ...tiktokVideos,
    ...(tiktokAnalysis !== null && { ...tiktokAnalysis }),
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
      console.log("ZIAD", toolName);
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
      initReport();
      setBeginCall(false);
    };
    if (!beginCall || !question) return;
    init();
  }, [beginCall, question]);

  useEffect(() => {
    if (
      !loading &&
      messages?.length === 2 &&
      tiktokRawReportContent &&
      tiktokNextSteps &&
      toolName === Tools.getSegmentsReport
    ) {
      console.log("ZIAD HERE");
    }
  }, [loading, messages, tiktokNextSteps, tiktokRawReportContent]);

  return {
    messages,
    append,
    loading: loading || isSearchingTrends,
    answer,
    setBeginCall,
  };
};

export default useToolChat;
