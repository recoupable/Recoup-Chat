import { Message, useChat } from "ai/react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <Messages messages={messages} />
      </div>
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
