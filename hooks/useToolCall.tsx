// import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolCall = (message: Message) => {
  // const { finalCallback } = useChatProvider();
  // const { clearQuery } = useChatProvider();
  const [isCalled, setIsCalled] = useState(false);
  const toolInvocations = [...(message.toolInvocations || [])];
  const toolInvocationResult = toolInvocations?.filter(
    (toolInvocation) => toolInvocation.state === "result",
  )?.[0];
  const question = toolInvocationResult?.result?.question || "";
  const context = toolInvocationResult?.result?.context || "";
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
      console.log("ZIAD", message);
    },
  });
  const answer = messages.filter(
    (message: Message) => message.role === "assistant",
  )?.[0]?.content;

  useEffect(() => {
    if (!question || !context) return;
    const isAssistant = message.role === "assistant";
    if (!isAssistant) return;
    if (isCalled) return;
    setIsCalled(true);
    append({
      id: uuidV4(),
      content: question,
      role: "user",
    });
  }, [question, context]);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
