import { useChatProvider } from "@/providers/ChatProvider";
import { useEffect, useRef, useCallback } from "react";
import Thinking from "./Thinking";
import Message from "./Message";
import { Message as AIMessage } from "ai";

const Messages = ({
  scroll,
}: {
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}) => {
  const { messages, pending } = useChatProvider();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce the scroll
    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const { scrollHeight, clientHeight } = containerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      scroll({ smooth: true, y: maxScroll });
    }, 100);
  }, [scroll]);

  // Handle initial scroll and message changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, pending, scrollToBottom]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full mt-4 max-w-2xl mx-auto overflow-y-auto hide-scrollbar">
      {messages.map((message: AIMessage, index: number) => (
        <Message message={message} key={index} scroll={scroll} />
      ))}
      {pending && messages.length > 0 && <Thinking />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
