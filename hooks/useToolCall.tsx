// import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolCall = (message: Message) => {
  // const { finalCallback } = useChatProvider();
  // const [answer, setAnswer] = useState("");
  // const { clearQuery } = useChatProvider();
  // const [isCalled, setIsCalled] = useState(false);
  const answer = "";
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

  console.log("ZIAD messages", messages);
  useEffect(() => {
    const init = async () => {
      if (question && context) {
        append({
          id: uuidV4(),
          content: question,
          role: "user",
        });
      }
    };

    if (!toolInvocationResult) return;
    const isAssistant = message.role === "assistant";
    if (!isAssistant || loading) return;
    init();
  }, [toolInvocationResult, loading]);

  return {
    loading,
    answer,
  };
};

export default useToolCall;
