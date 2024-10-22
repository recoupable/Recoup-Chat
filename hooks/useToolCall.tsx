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

  console.log("ZIAD toolInvocationResult", toolInvocationResult);

  useEffect(() => {
    console.log("ZIAD Message in useEffect", toolInvocationResult);

    const init = async () => {
      setLoading(true);
      let answer = "";
      const question = toolInvocationResult.result?.question || "";
      const context = toolInvocationResult.result?.context || "";

      if (question && context) {
        setIsCalled(true);
        const response = await fetch(`/api/tool_call`, {
          method: "POST",
          body: JSON.stringify({
            context,
            question,
          }),
        });
        const data = await response.json();
        answer = data.answer;
      }
      await finalCallback({
        role: "assistant",
        content: answer,
        id: "",
      });
      clearQuery();
      setAnswer(answer);
      setLoading(false);
    };

    if (!toolInvocationResult) return;

    const isAssistant = message.role === "assistant";

    console.log("ZIAD", isAssistant, loading, isCalled);
    if (!isAssistant || loading || isCalled) {
      setLoading(false);
      return;
    }
    init();
    console.log("ZIAD", message);
  }, [toolInvocationResult, isCalled]);

  console.log("ZIAD Message", message);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
