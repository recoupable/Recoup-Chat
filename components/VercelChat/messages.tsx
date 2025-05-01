"use client";

import { useEffect, useRef } from "react";
import { SpinnerIcon } from "./icons";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import Message from "./message";
import Markdown from "../Chat/ChatMarkdown-v2/markdown";
import { useInView } from "react-intersection-observer";

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return <Markdown content={text} />
}

interface MessagesProps {
  messages: Array<UIMessage>;
  status: UseChatHelpers["status"];
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  children?: React.ReactNode;
}

export function Messages({
  messages,
  status,
  setMessages,
  reload,
  children,
}: MessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({
    root: messagesRef.current,
    threshold: 0,
  });

  useEffect(() => {
    const scrollContainer = messagesRef.current;
    if (scrollContainer && inView) {
      // Use requestAnimationFrame to scroll after the next browser paint
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, [messages, status, inView]); // Add status to dependencies for streaming updates

  return (
    <div
      className="flex relative flex-col gap-8 overflow-y-scroll items-center w-full"
      ref={messagesRef}
    >
      {children || null}
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          setMessages={setMessages}
          reload={reload}
        />
      ))}

      {(status === "submitted" || status === "streaming") && (
        <div className="text-zinc-500 mb-12 w-full flex items-center gap-2">
          Hmm...
          <div className="inline-block animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      )}
      <div ref={ref} className="h-4 bg-transparent select-none opacity-0 z-10 w-full flex items-center justify-center text-white font-bold" >
        {inView ? 'Yes' : 'No'}
      </div>
    </div>
  );
}
