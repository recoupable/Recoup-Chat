import { Message as AIMessage } from "ai/react";
import { useEffect, useRef } from "react";
import Message from "./Message";

interface MessagesProps {
  messages: AIMessage[];
}

export default function Messages({ messages }: MessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full mt-4 max-w-3xl mx-auto overflow-y-auto grow">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
