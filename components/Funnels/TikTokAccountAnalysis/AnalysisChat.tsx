import ChatInput from "@/components/Chat/ChatInput";
import Messages from "@/components/Chat/Messages";
import { ScrollTo } from "react-scroll-to";
import FanSegmentResult from "./FanSegmentResult";

const AnalysisChat = () => {
  return (
    <main className="flex-1 flex md:p-4 bg-background">
      <div className="h-[calc(100vh-64px)] md:h-full bg-white rounded-xl w-full">
        <div className="px-4 max-w-3xl mx-auto w-full h-full mx-auto md:pt-4 flex flex-col bg-white">
          <div className="grow flex flex-col pb-4 h-full">
            <ScrollTo>
              {({ scroll }) => (
                <>
                  <Messages scroll={scroll} className="!grow">
                    <FanSegmentResult />
                  </Messages>
                </>
              )}
            </ScrollTo>
            <div className="space-y-2">
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnalysisChat;
