"use client";

import { ScrollTo } from "react-scroll-to";
import InstantMessages from "./InstantMessages";
import InstantChatInput from "./InstantChatInput";
import { InstantChatProvider } from "@/providers/InstantChatProvider";

const InstantChat = () => {
  return (
    <InstantChatProvider>
      <div className="flex flex-col h-full">
        <ScrollTo>
          {({ scroll }) => (
            <div className="flex-1 min-h-0">
              <InstantMessages scroll={scroll} />
            </div>
          )}
        </ScrollTo>
        <InstantChatInput />
      </div>
    </InstantChatProvider>
  );
};

export default InstantChat;
