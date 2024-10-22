import { useChatProvider } from "@/providers/ChatProvider";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ScrollTo } from "react-scroll-to";

const Chat = () => {
  const { messages } = useChatProvider();
  return (
    <div
      className={`grow h-screen overflow-hidden flex flex-col ${messages.length ? "px-4 pb-5 pt-20" : "items-center justify-center"}`}
    >
      <ScrollTo>{({ scroll }) => <Messages scroll={scroll} />}</ScrollTo>
      <ChatInput />
    </div>
  );
};

export default Chat;
