import { useMessagesProvider } from "@/providers/MessagesProvider";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ScrollTo } from "react-scroll-to";
import ChatSkeleton from "./ChatSkeleton";

const Chat = () => {
  const { isLoading } = useMessagesProvider();

  if (isLoading) return <ChatSkeleton />;
  return (
    <div className="size-full flex flex-col items-center justify-center bg-white rounded-xl overflow-hidden flex flex-col px-4 pb-5 md:pt-[14px]">
      <ScrollTo>{({ scroll }) => <Messages scroll={scroll} />}</ScrollTo>
      <ChatInput />
    </div>
  );
};

export default Chat;
