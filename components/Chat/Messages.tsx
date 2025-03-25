"use client";

import { useEffect, useMemo, useRef } from "react";
import cn from "classnames";
import { ReasoningMessagePart } from "./ReasoningMessagePart";
import { TextMessagePart } from "./TextMessagePart";
import { MessagePart, ChatMessage } from "@/types/reasoning";
import { useMessagesProvider } from "@/providers/MessagesProvider";

const Messages = () => {
  const { messages, pending, isLoading } = useMessagesProvider();
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }

  const renderMessageContent = (message: ChatMessage) => {
    // Handle legacy message format or undefined parts
    if (!message.parts?.length) {
      return <TextMessagePart part={{ type: "text", text: message.content }} />;
    }

    // Handle new message format with parts
    return message.parts.map((part: MessagePart, partIndex) => {
      try {
        if (part.type === "text") {
          return (
            <TextMessagePart key={`${message.id}-${partIndex}`} part={part} />
          );
        }

        if (part.type === "reasoning") {
          return (
            <ReasoningMessagePart
              key={`${message.id}-${partIndex}`}
              part={part}
              isReasoning={
                pending && partIndex === (message.parts?.length ?? 0) - 1
              }
            />
          );
        }
      } catch (error) {
        console.error("Error rendering message part:", error);
        return (
          <div key={`${message.id}-${partIndex}`} className="text-red-500">
            Error displaying message
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div
      className="flex flex-col gap-8 overflow-y-scroll items-center w-full"
      ref={messagesRef}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col gap-4 last-of-type:mb-12 first-of-type:mt-16 w-full"
          )}
        >
          <div
            className={cn("flex flex-col gap-4", {
              "dark:bg-zinc-800 bg-zinc-200 p-2 rounded-xl w-fit ml-auto":
                message.role === "user",
              "": message.role === "assistant",
            })}
          >
            {renderMessageContent(message as ChatMessage)}
          </div>
        </div>
      ))}

      {pending && <div className="text-zinc-500 mb-12 w-full">Hmm...</div>}
    </div>
  );
};

export default Messages;
