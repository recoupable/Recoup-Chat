import Suggestions from "./Suggestions";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

const Chat = () => {
  return (
    <div>
      <ChatInput />
      <Messages />
      <Suggestions />
    </div>
  );
};

export default Chat;
