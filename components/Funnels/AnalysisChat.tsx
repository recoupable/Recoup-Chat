import ChatInput from "@/components/Chat/ChatInput";
import Messages from "@/components/Chat/Messages";
import { ScrollTo } from "react-scroll-to";
import FanSegmentResult from "./FanSegmentResult";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import isScraping from "@/lib/agent/isScraping";

const AnalysisChat = () => {
  const { agentsStatus, isCheckingHandles } = useFunnelAnalysisProvider();

  return (
    <main className="grow py-2">
      <div className="px-4 md:max-w-3xl md:mx-auto md:w-full h-full md:pt-4 flex flex-col bg-white">
        <div className="md:grow flex flex-col pb-4 h-full">
          <ScrollTo>
            {({ scroll }) => (
              <>
                <Messages scroll={scroll} className="!grow">
                  <FanSegmentResult />
                </Messages>
              </>
            )}
          </ScrollTo>
          {!isScraping(agentsStatus) && !isCheckingHandles && (
            <div className="space-y-2">
              <ChatInput />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AnalysisChat;
