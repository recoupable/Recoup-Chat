import { useChatProvider } from "@/providers/ChatProvider";
import { useEffect, useRef } from "react";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pending]);

  return (
    <div className="w-full mt-4 max-w-3xl mx-auto overflow-y-auto hide-scrollbar">
      {messages.map((message: AIMessage, index: number) => (
        <Message message={message} key={index} scroll={scroll} />
      ))}
      {pending && messages.length > 0 && <Thinking />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
