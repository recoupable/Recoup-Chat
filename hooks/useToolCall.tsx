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
    console.log("ZIAD Message in useEffect", message);

    const init = async () => {
      setLoading(true);
      let answer = "";
      console.log("ZIAD init", message);

      if (message.toolInvocations) {
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
      }
      setAnswer(answer);
      setLoading(false);
    };

    const isAssistant = message.role === "assistant";

    const toolInvocationResult = message.toolInvocations?.filter(
      (toolInvocation) => toolInvocation.state === "result",
    );
    console.log("ZIAD toolInvocationResult", toolInvocationResult)
    if (!toolInvocationResult?.length) return;

    const question = toolInvocationResult[0].result?.question || "";
    const context = toolInvocationResult[0].result?.context || "";

    if (!isAssistant || loading || isCalled) {
      setLoading(false);
      return;
    }
    init();
    console.log("ZIAD", message);
  }, [message, isCalled]);

  console.log("ZIAD Message", message);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
