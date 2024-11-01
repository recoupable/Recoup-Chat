import { useChatProvider } from "@/providers/ChatProvider";
import { LoaderCircle, TvMinimalPlay } from "lucide-react";

const Thinking = () => {
  const { messages } = useChatProvider();
  const message = messages?.[messages?.length - 1];
  // const toolInvocations = [...(message.toolInvocations || [])];
  // const toolInvocationResult = toolInvocations?.filter(
  //   (toolInvocation) => toolInvocation.state === "result",
  // )?.[0];
  // const toolName = toolInvocationResult?.toolName;
  console.log("ZIAD HERE", message);

  return (
    <div className="p-3 flex gap-2 w-full max-w-3xl mx-auto items-center pb-2">
      <div className="size-fit">
        <TvMinimalPlay className="h-6 w-6" />
      </div>
      <p>is thinking...</p>
      <LoaderCircle className="h-4 w-4 animate-spin" />
    </div>
  );
};

export default Thinking;
