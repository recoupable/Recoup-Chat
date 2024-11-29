"use client";

import ChatInput from "@/components/Chat/ChatInput";
import { useChatProvider } from "@/providers/ChatProvider";
import { ToolCallProvider } from "@/providers/ToolCallProvider";
import { Message } from "ai";
import { ScrollArea, ScrollTo } from "react-scroll-to";
import ReportSummary from "./ReportSummary";

const TikTokAnalysisReport = () => {
  const { messages } = useChatProvider();
  const answer = messages
    .reverse()
    .find((message: Message) => message.role === "assistant");

  return (
    <main className="flex-1 flex md:p-4 bg-background">
      <div className="h-[calc(100vh-64px)] md:h-full bg-white rounded-xl w-full">
        <div className="px-4 max-w-3xl mx-auto w-full h-full mx-auto md:pt-4 flex flex-col bg-white">
          <div className="grow flex flex-col pb-4 h-full">
            <ScrollTo>
              {({ scroll }) => (
                <ScrollArea className="w-full mt-4 max-w-3xl mx-auto overflow-y-auto">
                  <ToolCallProvider
                    message={answer as Message}
                    scrollTo={() =>
                      scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER })
                    }
                  >
                    <ReportSummary />
                  </ToolCallProvider>
                </ScrollArea>
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

export default TikTokAnalysisReport;
