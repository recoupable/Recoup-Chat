import { useChatProvider } from "@/providers/ChatProvider";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ScrollTo } from "react-scroll-to";

const Chat = () => {
  const { messages } = useChatProvider();

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex flex-col ${messages.length ? "px-4 pb-5 pt-20" : "items-center justify-center"}`}
    >
      <p className="font-sans font-semibold text-2xl mb-2 text-center">
        {`How is Luh Tyler's 3D Game Performing?`}
      </p>
      {messages.length === 0 && <ChatInput />}
      <ScrollTo>{({ scroll }) => <Messages scroll={scroll} />}</ScrollTo>
      {messages.length > 0 && <ChatInput />}
    </div>
  );
};

export default Chat;
