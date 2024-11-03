import useToolCall from "@/hooks/useToolCall";
import { useChatProvider } from "@/providers/ChatProvider";
import { Message as AIMessage } from "ai";
import Image from 'next/image';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();
  const { loading, answer, toolName, context, fans } = useToolCall(message);
  const { pending } = useChatProvider();
  const isHidden = pending && message.role === "assistant" && !message.content && message?.toolInvocations;
  const content = message.content || answer;
  const isUser = message.role === "user";

  const logoSrc = theme === 'dark' ? '/logo-light.png' : '/logo-dark.png';

  useEffect(() => {
    scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });
    const timeoutId = setTimeout(() => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER }), 100);
    return () => clearTimeout(timeoutId);
  }, [content, context, scroll]);

  return (
    <div className={`mb-10 ${isHidden && "hidden"}`}>
      <div className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}>
        {!isUser && (
          <Image 
            src="/chat-response-icon-lightmode.svg"
            alt="Chat Response Icon"
            width={24}
            height={24}
            className="flex-shrink-0 -mt-0.5"
          />
        )}
        <div 
          className={`
            inline-block max-w-[85%]
            ${isUser 
              ? "bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2" 
              : ""
            }
          `}
        >
          <div className="text-base leading-relaxed text-pretty break-words font-[450] text-gray-800 dark:text-gray-100">
            <ReactMarkdown 
              className={`prose max-w-none ${
                isUser 
                  ? "prose-gray dark:prose-invert" 
                  : "prose-gray dark:prose-invert"
              }`}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
