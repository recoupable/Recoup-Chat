"use client";

import { useEffect, useMemo, useRef } from "react";
import { SpinnerIcon } from "./icons";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import Message from "./message";
import Markdown from "../Chat/ChatMarkdown-v2/markdown";

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return (
    <div className="flex flex-col gap-4">
      <Markdown content={text} />
    </div>
  );
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
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  return (
    <div
      className="flex flex-col gap-8 overflow-y-scroll items-center w-full"
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
    </div>
  );
}
