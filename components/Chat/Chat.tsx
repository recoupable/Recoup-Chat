import { useChatProvider } from "@/providers/ChatProvider";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

const Chat = () => {
  const { messages } = useChatProvider();

  return (
    <div
      className={`w-screen overflow-hidden ${messages.length ? "px-4 pt-20 mb-[150px] overflow-y-auto h-[calc(100vh-150px)]" : "flex flex-col items-center justify-center h-screen"}`}
    >
      <p className="font-sans font-semibold text-2xl mb-2 text-center">
        {`How is Luh Tyler's 3D Game Performing?`}
      </p>
      <ChatInput />
      <Messages />
    </div>
  );
};

export default Chat;
