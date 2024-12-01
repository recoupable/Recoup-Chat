import { Message as AIMessage } from "ai";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";
import Icon from "../Icon";
import { useChatProvider } from "@/providers/ChatProvider";

const Message = ({ message, index }: { message: AIMessage; index: number }) => {
  const { context, loading } = useToolCallProvider();
  const { reportEnabled, pending } = useChatProvider();

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
          <Icon name="logo-xs" />
        </div>
      )}
      <div className={`grow ${message.role === "user" && "flex justify-end"}`}>
        {context && <ToolContent />}
        <ToolFollowUp message={message} />
        {reportEnabled && index === 0 && !pending && !loading && (
          <>
            <button
              type="button"
              className="text-purple-dark mt-6"
            >{`[Download Full Report PDF]`}</button>
            <p className="py-4 text-[20px]">Next Steps</p>
            <ul className="text-[14px] space-y-2 ml-5">
              <li className="list-disc">
                <span className="font-bold">
                  Explore Partnership Opportunities:
                </span>{" "}
                Select a suggested brand to generate a tailored pitch deck.
              </li>
              <li className="list-disc">
                <span className="font-bold">Refine Content Ideas:</span> Get
                recommendations for TikTok content tailored to this segment..
              </li>
              <li className="list-disc">
                <span className="font-bold">Monitor & Update:</span> Enable
                continuous tracking for this segment to uncover new trends and
                engagement opportunities. Ongoing Tracking Enabled ✅
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
