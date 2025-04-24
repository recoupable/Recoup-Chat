import { UIMessage } from "ai";
import { ReasoningMessagePart, TextMessagePart } from "./messages";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import EditButton from "./EditButton";
import { cn } from "@/lib/utils";

const Message = ({ message }: { message: UIMessage }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          key={message.id}
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          <div className={cn("flex flex-col gap-4 w-full")}>
            {message.parts?.map((part, partIndex) => {
              const { type } = part;
              const key = `message-${message.id}-part-${partIndex}`;

              if (type === "text") {
                return (
                  <div key={key} className="flex flex-row gap-2 items-center">
                    {message.role === "user" && mode === "view" && (
                      <EditButton onClick={() => setMode("edit")} />
                    )}
                    <div
                      data-testid="message-content"
                      className={cn("flex flex-col gap-4", {
                        "dark:bg-zinc-800 bg-zinc-100 px-5 py-3.5 rounded-xl":
                          message.role === "user",
                      })}
                    >
                      <TextMessagePart text={part.text} />
                    </div>
                  </div>
                );
              }

              if (part.type === "reasoning") {
                return (
                  <ReasoningMessagePart
                    key={`${message.id}-${partIndex}`}
                    // @ts-expect-error export ReasoningUIPart
                    part={part}
                    isReasoning={
                      status === "streaming" &&
                      partIndex === message.parts.length - 1
                    }
                  />
                );
              }
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Message;
