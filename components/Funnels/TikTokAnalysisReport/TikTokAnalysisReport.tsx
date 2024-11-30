"use client";

import ChatInput from "@/components/Chat/ChatInput";
import { ScrollTo } from "react-scroll-to";
import Messages from "@/components/Chat/Messages";
import { useChatProvider } from "@/providers/ChatProvider";

const TikTokAnalysisReport = () => {
  const { messages } = useChatProvider();

  console.log("ZIAD", messages);
  return (
    <div className="grow h-[calc(100vh-56px)] md:h-screen bg-background p-4">
      <div
        className={`size-full flex flex-col items-center justify-center bg-white rounded-xl overflow-hidden flex flex-col ${messages.length ? "px-4 pb-5 md:pt-20" : "items-center justify-center"}`}
      >
        <ScrollTo>
          {({ scroll }) => (
            <Messages scroll={scroll} messages={messages.slice(1)} />
          )}
        </ScrollTo>
        <ChatInput />
      </div>
    </div>
  );
};

export default TikTokAnalysisReport;
