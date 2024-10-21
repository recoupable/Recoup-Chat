import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { useEffect, useState } from "react";

const useToolCall = (message: Message) => {
  const [loading, setLoading] = useState(true);
  const { finalCallback } = useChatProvider();
  const [answer, setAnswer] = useState("");
  const { clearQuery } = useChatProvider();

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

    const isAssistant = message.role === "assistant";
    const question =
      message?.toolInvocations?.[0].state === "result"
        ? message.toolInvocations[0].result?.question
        : "";
    const context =
      message?.toolInvocations?.[0].state === "result"
        ? message.toolInvocations[0].result?.context
        : "";
    if (!isAssistant) {
      setLoading(false);
      return;
    }
    init();
  }, [message.toolInvocations, message.content]);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
