import useToolCall from "@/hooks/useToolCall";
import { useChatProvider } from "@/providers/ChatProvider";
import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ToolContent from "../Tools/ToolContent";

const Message = ({
  message,
  scroll,
}: {
  message: AIMessage;
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}) => {
  const { loading, answer, toolName, context, fans } = useToolCall(message);
  const { pending } = useChatProvider();
  const Icon = message.role === "user" ? UserIcon : TvMinimalPlay;
  const isHidden = pending && message.role === "assistant" && !message.content && message?.toolInvocations;
  const content = message.content || answer;
  const isUser = message.role === "user";

  useEffect(() => {
    scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });
    const timeoutId = setTimeout(() => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER }), 100);
    return () => clearTimeout(timeoutId);
  }, [content, context]);

  return (
    <div className={`mb-8 ${isHidden && "hidden"}`}>
      <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        <Icon className={`h-4 w-4 flex-shrink-0 text-gray-400 ${isUser ? "mt-[10px]" : "mt-1"}`} />
        <div className={`flex-1 ${isUser ? "text-right" : "text-left"}`}>
          {context && (
            <ToolContent
              toolName={toolName}
              context={context}
              fans={fans}
            />
          )}
          {loading && !content && toolName === "getCampaign" ? (
            <div className={`flex items-center gap-2 text-gray-400 ${isUser ? "justify-end" : "justify-start"}`}>
              <p className="text-sm">is thinking...</p>
              <LoaderCircle className="h-3 w-3 animate-spin" />
            </div>
          ) : (
            <div className={`${isUser ? "flex justify-end" : ""}`}>
              <div className={`inline-block text-[15px] leading-relaxed text-pretty break-words 
                ${isUser 
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-2xl" 
                  : ""}`}
              >
                <ReactMarkdown className={`prose max-w-none ${isUser ? "" : "prose-invert"}`}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
