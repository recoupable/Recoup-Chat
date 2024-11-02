import { useChatProvider } from "@/providers/ChatProvider";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ScrollTo } from "react-scroll-to";

const Chat = () => {
  const { messages } = useChatProvider();
  
  return (
    <div className={`grow h-screen overflow-hidden flex flex-col ${
      messages.length ? "px-4 md:px-6 pb-5 pt-20" : "items-center justify-center"
    }`}>
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
        <ScrollTo>
          {({ scroll }) => (
            <div className="flex-grow overflow-y-auto hide-scrollbar">
              <Messages scroll={scroll} />
            </div>
          )}
        </ScrollTo>
        <div className="flex-none pt-4">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Chat;
