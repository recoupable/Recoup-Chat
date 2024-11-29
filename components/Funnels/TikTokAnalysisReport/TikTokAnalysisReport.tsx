"use client";

import ChatInput from "@/components/Chat/ChatInput";
import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { ScrollArea, ScrollTo } from "react-scroll-to";

const TikTokAnalysisReport = () => {
  const { messages } = useChatProvider();
  console.log("ZIAD",  messages)
  
  const answer = messages.find((message: Message) => message.role === "system");

  return (
    <main className="flex-1 flex md:p-4 bg-background">
      <div className="h-[calc(100vh-64px)] md:h-full bg-white rounded-xl w-full">
        <div className="px-4 max-w-3xl mx-auto w-full h-full mx-auto md:pt-4 flex flex-col bg-white">
          <div className="grow flex flex-col pb-4 h-full">
            <ScrollTo>
              {() => (
                <ScrollArea className="w-full mt-4 max-w-3xl mx-auto overflow-y-auto">
                  <section>
                    <div
                      className="text-sm font-sans max-w-[500px] text-pretty break-words "
                      dangerouslySetInnerHTML={{
                        __html: decodeURIComponent(
                          answer?.content?.replaceAll("%", "&#37;") || "",
                        ),
                      }}
                    />
                  </section>
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
