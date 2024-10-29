import { useChatProvider } from "@/providers/ChatProvider";
import { FAN_TYPE } from "@/types/fans";
import { ArtistToolResponse } from "@/types/Tool";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolCall = (message: Message) => {
  const { finalCallback, clearQuery } = useChatProvider();
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
  const answer = messages.filter(
    (message: Message) => message.role === "assistant",
  )?.[0]?.content;

  useEffect(() => {
    if (!context) return;
    if (
      toolName === "createArtist" &&
      context?.status === ArtistToolResponse.CREATED_ARTIST
    ) {
      finalCallback(
        {
          id: uuidV4(),
          content: `Name: ${context.data.name}, Id: ${context.data.id}`,
          role: "assistant",
        },
        {
          id: uuidV4(),
          content: `${context.data.name}`,
          role: "user",
        },
        conversationId as string,
      );
      return;
    }
    if (!question) return;
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
