import { useChatProvider } from "@/providers/ChatProvider";
import { FAN_TYPE } from "@/types/fans";
import { Message } from "ai";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import useToolChat from "./useToolChat";
import { useParams } from "next/navigation";
import getArtistMessage from "@/lib/getArtistMessage";
import getCampaignMessage from "@/lib/getCampaignMessage";

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
  const { messages, append, loading } = useToolChat(question, context);
  const answer = messages.filter(
    (message: Message) => message.role === "assistant",
  )?.[0]?.content;

  useEffect(() => {
    if (!context || !question) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArtistMessage: any = getArtistMessage(toolName, context);
    if (newArtistMessage) {
      finalCallback(
        newArtistMessage,
        { id: uuidV4(), content: question, role: "user" },
        conversationId as string,
      );
      return;
    }

    const newCampaignMessage: any = getCampaignMessage(toolName, context);
    if (newCampaignMessage) {
      finalCallback(
        newCampaignMessage,
        { id: uuidV4(), content: question, role: "user" },
        conversationId as string,
      );
      return;
    }

    const isAssistant = message.role === "assistant";
    if (!isAssistant) return;
    if (isCalled) return;
    setIsCalled(true);
    if (toolName === "getCampaign")
      append({
        id: uuidV4(),
        content: question,
        role: "user",
      });
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
