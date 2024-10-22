import getToolCallUrl from "@/lib/getToolCallUrl";
import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { useEffect, useState } from "react";

const useToolCall = (message: Message) => {
  const [loading, setLoading] = useState(false);
  const { finalCallback } = useChatProvider();
  const [answer, setAnswer] = useState("");
  const { clearQuery } = useChatProvider();
  const [isCalled, setIsCalled] = useState(false);

  const toolInvocations = [...(message.toolInvocations || [])];
  const toolInvocationResult = toolInvocations?.filter(
    (toolInvocation) => toolInvocation.state === "result",
  )?.[0];

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let answer = "";
      const question = toolInvocationResult.result?.question || "";
      const context = toolInvocationResult.result?.context || "";

      if (question && context) {
        setIsCalled(true);
        const toolCallApi = getToolCallUrl(toolInvocationResult.toolName);
        const response = await fetch(toolCallApi, {
          method: "POST",
          body: JSON.stringify({
            context,
            question,
          }),
        });
        const data = await response.json();
        answer = data.answer;
        await finalCallback({
          role: "assistant",
          content: answer,
          id: "",
        });
        setAnswer(answer);
      }
      clearQuery();
      setLoading(false);
    };

    if (!toolInvocationResult) return;

    const isAssistant = message.role === "assistant";

    if (!isAssistant) {
      setLoading(false);
      return;
    }
    if (isCalled || loading) return;
    init();
  }, [toolInvocationResult, isCalled]);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
