import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { useEffect, useState } from "react";

const useToolCall = (message: Message) => {
  const [loading, setLoading] = useState(false);
  const { finalCallback } = useChatProvider();
  const [answer, setAnswer] = useState("");
  const { clearQuery } = useChatProvider();
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let answer = "";
      if (message.toolInvocations) {
        if (question && context) {
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
      }
      setAnswer(answer);
      setLoading(false);
    };

    console.log("ZIAD", message)
    const isAssistant = message.role === "assistant";

    const toolInvocationResult = message.toolInvocations?.filter(
      (toolInvocation) => toolInvocation.state === "result",
    );
    if (!toolInvocationResult?.length) return;

    const question = toolInvocationResult[0].result?.question || "";
    const context = toolInvocationResult[0].result?.context || "";

    if (question && context) setIsCalled(true);
    if (!isAssistant || loading || isCalled) {
      setLoading(false);
      return;
    }
    init();
  }, [message, isCalled]);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
