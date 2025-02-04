import { useChat } from "ai/react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat/o3",
  });

  return (
    <div className="size-full flex flex-col items-center justify-center bg-white rounded-xl overflow-hidden flex flex-col px-4 pb-5 md:pt-[14px]">
      <div className="w-[calc(100vw-90px)] max-w-3xl mx-auto flex-1 overflow-y-auto">
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
