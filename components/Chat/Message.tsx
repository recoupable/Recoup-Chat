import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import Icon from "../Icon";
import ToolFollowUp from "../Tools/ToolFollowUp";

// eslint-disable-next-line
const Message = ({ message }: { message: any; index: number }) => {
  const { context } = useToolCallProvider();

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
          <Icon name="logo-xs" />
        </div>
      )}
      <div
        className={`grow ${message.role === "user" && "flex justify-end"} max-w-[90%]`}
      >
        {context && <ToolContent />}
        <ToolFollowUp message={message} />
      </div>
    </div>
  );
};

export default Message;
