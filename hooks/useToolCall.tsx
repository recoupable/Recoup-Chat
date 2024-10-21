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
      setAnswer(answer);

      await finalCallback({
        role: "assistant",
        content: answer,
        id: "",
      });

      clearQuery();
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
  }, [message]);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
