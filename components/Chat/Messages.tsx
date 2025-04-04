"use client";

import { useEffect } from "react";
import { ScrollArea } from "react-scroll-to";
import { cn } from "@/lib/utils";
import { ReasoningMessagePart } from "./ReasoningMessagePart";
import { TextMessagePart } from "./TextMessagePart";
import { IconRobot } from "@tabler/icons-react";
import ChatMarkdown from "./ChatMarkdown";

// Using a more generic type to handle different message structures
interface MessageLike {
  id: string;
  role: string;
  content: string;
  parts?: MessagePartLike[]; // More specific part type
}

// Generic message part interface that covers necessary properties
interface MessagePartLike {
  type: string;
  text?: string;
  reasoning?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Array<{ type: string; text?: string; [key: string]: any }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

interface MessagesProps {
  messages: MessageLike[];
  pending?: boolean;
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
  className?: string;
  children?: React.ReactNode;
}

const Messages = ({
  messages,
  pending = false,
  scroll,
  className,
  children,
}: MessagesProps) => {
  // Use the scroll prop to scroll to bottom when messages change
  useEffect(() => {
    scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });
  }, [messages, pending, scroll]);

  console.log("[Messages] pending", pending);

  return (
    <ScrollArea
      className={cn(
        "w-full h-full max-w-3xl mx-auto overflow-y-auto",
        className
      )}
    >
      {children || <div />}
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex items-start gap-x-3 py-4 px-4", {
            "justify-end": message.role === "user",
          })}
        >
          {message.role === "assistant" && (
            <div className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
              <IconRobot className="h-4 w-4" />
            </div>
          )}
          <div
            className={cn("flex flex-col space-y-1.5", {
              "flex items-start bg-secondary/70 rounded-xl px-4 py-3 max-w-[85%] md:max-w-[70%] break-words":
                message.role === "user",
            })}
          >
            {message.role === "user" ? (
              <ChatMarkdown>{message.content}</ChatMarkdown>
            ) : message.parts && message.parts.length > 0 ? (
              message.parts.map((part, i) => {
                // Simple check for reasoning parts by looking for the type property
                if (part.type === "reasoning") {
                  return (
                    <ReasoningMessagePart
                      key={i}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      part={part as any}
                      isReasoning={
                        pending && i === (message.parts?.length ?? 0) - 1
                      }
                    />
                  );
                }
                // Default to text part
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return <TextMessagePart key={i} part={part as any} />;
              })
            ) : (
              <TextMessagePart part={{ type: "text", text: message.content }} />
            )}
          </div>
        </div>
      ))}
      {pending && (
        <div className="flex items-center gap-x-3 py-4 px-4">
          <div className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
            <IconRobot className="h-4 w-4" />
          </div>
          <div>Hmm...</div>
        </div>
      )}
    </ScrollArea>
  );
};

export default Messages;
