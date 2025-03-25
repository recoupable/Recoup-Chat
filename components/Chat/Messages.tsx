"use client";

import { useEffect } from "react";
import { ScrollArea } from "react-scroll-to";
import { cn } from "@/lib/utils";
import { ReasoningMessagePart } from "./ReasoningMessagePart";
import { TextMessagePart } from "./TextMessagePart";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import { IconRobot } from "@tabler/icons-react";

const Messages = ({
  scroll,
  className,
  children,
}: {
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  const { messages, pending } = useMessagesProvider();
  const { prompts } = usePromptsProvider();
  const scrollTo = () => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });

  useEffect(() => {
    scrollTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, pending, prompts]);

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
            "bg-secondary/50": message.role === "assistant",
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
              "w-fit": message.role === "user",
            })}
          >
            {message.parts?.map((part, i) => {
              if (part.type === "reasoning") {
                return (
                  <ReasoningMessagePart
                    key={i}
                    part={part}
                    isReasoning={
                      pending && i === (message.parts?.length ?? 0) - 1
                    }
                  />
                );
              }
              return <TextMessagePart key={i} part={part} />;
            }) || (
              <TextMessagePart part={{ type: "text", text: message.content }} />
            )}
          </div>
        </div>
      ))}
      {pending && (
        <div className="flex items-center gap-x-3 py-4 px-4 bg-secondary/50">
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
