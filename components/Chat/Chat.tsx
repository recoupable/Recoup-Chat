import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ScrollTo } from "react-scroll-to";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import InitialChat from "./InitialChat";

const Chat = () => {
  const { messages } = useMessagesProvider();
  return (
    <>
      {messages.length ? (
        <div className="grow h-[calc(100vh-56px)] md:h-screen bg-background p-4">
          <div
            className={`size-full flex flex-col items-center justify-center bg-white rounded-xl overflow-hidden flex flex-col ${messages.length ? "px-4 pb-5 md:pt-[14px]" : "items-center justify-center"}`}
          >
            <ScrollTo>{({ scroll }) => <Messages scroll={scroll} />}</ScrollTo>
            <ChatInput />
          </div>
        </div>
      ) : (
        <InitialChat />
      )}
    </>
  );
};

export default Chat;
