import { Message as AIMessage } from "ai";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";
import Image from 'next/image';

const Message = ({ message }: { message: AIMessage }) => {
  const { context } = useToolCallProvider();
  const isUser = message.role === "user";

  return (
    <div className={`py-4 mb-1 flex w-full gap-3 ${isUser ? 'justify-end mt-6' : 'mt-6'}`}>
      {!isUser && (
        <div className="size-fit">
          <Image 
            src="/chat-response-icon-lightmode.svg"
            alt="AI"
            width={24}
            height={24}
            className="dark:invert opacity-75"
          />
        </div>
      )}
      <div className={`max-w-2xl ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        {context && <ToolContent />}
        <div className={`
          text-[16px] leading-7 
          font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]
          antialiased
          ${isUser 
            ? 'bg-gray-50 dark:bg-gray-900 px-3.5 py-[6px] rounded-2xl ml-auto'
            : 'px-1'
          }`}>
          <ToolFollowUp message={message} />
        </div>
      </div>
    </div>
  );
};

export default Message;
