import { useChatProvider } from "@/providers/ChatProvider";
import { FAN_TYPE } from "@/types/fans";
import { Message } from "ai";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import useToolChat from "./useToolChat";
import { useParams } from "next/navigation";
import { ArtistToolResponse } from "@/types/Tool";
import getToolCallMessage from "@/lib/getToolCallMessage";

const useToolCall = (message: Message) => {
  const { finalCallback } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const [isCalled, setIsCalled] = useState(false);
  const toolInvocations = [...(message.toolInvocations || [])];
  const toolInvocationResult = toolInvocations?.filter(
    (toolInvocation) => toolInvocation.state === "result",
  )?.[0];
  const question = toolInvocationResult?.result?.question || "";
  const context = toolInvocationResult?.result?.context || "";
  const toolName = toolInvocationResult?.toolName;
  const fans = context?.fans?.filter((fan: FAN_TYPE) => fan.name !== "Unknown");
  const { messages, append, loading, setTiktokTrends } = useToolChat(
    question,
    context,
    toolName,
  );
  const answer = messages.filter(
    (message: Message) => message.role === "assistant",
  )?.[0]?.content;

  useEffect(() => {
    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newToolCallMessage: any = getToolCallMessage(toolName, context);
      if (newToolCallMessage) {
        finalCallback(
          newToolCallMessage,
          { id: uuidV4(), content: question, role: "user" },
          conversationId as string,
        );
        return;
      }

      const isAssistant = message.role === "assistant";
      if (!isAssistant) return;
      if (isCalled) return;
      setIsCalled(true);
      if (
        toolName === "getCampaign" ||
        (toolName === "getArtistAnalysis" &&
          context.status === ArtistToolResponse.TIKTOK_TRENDS)
      ) {
        if (toolName === "getArtistAnalysis") {
          const response = await fetch(
            `/api/trends?handle=${context?.username}`,
          );
          const data = await response.json();
          setTiktokTrends(data);
        }
        append({
          id: uuidV4(),
          content: question,
          role: "user",
        });
      }
    };
    if (!context || !question) return;
    init();
  }, [question, context, toolName]);

  return {
    loading,
    answer,
    toolName,
    question,
    context,
    fans,
  };
};

export default useToolCall;
