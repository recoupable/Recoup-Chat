import React, { Dispatch, SetStateAction } from "react";
import { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { TextMessagePart } from "./messages";
import EditButton from "./EditButton";

interface ViewingMessageProps {
  message: UIMessage;
  partText: string;
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
}

const ViewingMessage: React.FC<ViewingMessageProps> = ({
  message,
  partText,
  setMode,
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      {message.role === "user" && (
        <EditButton onClick={() => setMode("edit")} />
      )}
      <div
        data-testid="message-content"
        className={cn("flex flex-col gap-4", {
          "dark:bg-zinc-800 bg-zinc-100 px-5 py-3.5 rounded-xl":
            message.role === "user",
        })}
      >
        <TextMessagePart text={partText} />
      </div>
    </div>
  );
};

export default ViewingMessage;
