import React, { Dispatch, SetStateAction, memo } from "react";
import { UIMessage } from "ai";
import { MessageEditor } from "./message-editor";
import { UseChatHelpers } from "@ai-sdk/react";

interface EditingMessageProps {
  message: UIMessage;
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
}

const EditingMessageComponent: React.FC<EditingMessageProps> = ({
  message,
  setMode,
  setMessages,
  reload,
}) => {
  return (
    <div className="flex flex-row gap-2 items-start">
      <div className="size-8" />
      <MessageEditor
        key={message.id}
        message={message}
        setMode={setMode}
        setMessages={setMessages}
        reload={reload}
      />
    </div>
  );
};

const EditingMessage = memo(EditingMessageComponent, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id;
});

export default EditingMessage;
