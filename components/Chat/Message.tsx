import { useChatProvider } from "@/providers/ChatProvider";
import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";

const Message = ({ message }: { message: AIMessage }) => {
  const { loading, answer, toolName, context } = useToolCallProvider();
  const { pending } = useChatProvider();
  const Icon = message.role === "user" ? UserIcon : TvMinimalPlay;
  const isHidden =
    pending &&
    message.role === "assistant" &&
    !message.content &&
    message?.toolInvocations;
  const content = message.content || answer;

  useEffect(() => {
    scrollTo();
    const timeoutId = setTimeout(scrollTo, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, context]);

  return (
    <div className={`p-3 rounded-lg flex w-full gap-2 ${isHidden && "hidden"}`}>
      <div className="size-fit">
        <Icon className="h-6 w-6" />
      </div>
      <div className="grow">
        {context && <ToolContent />}
        {loading && !content && toolName === "getCampaign" ? (
          <div className="flex gap-2 items-center">
            <p>is thinking...</p>
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="text-sm font-sans text-pretty break-words">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
