"use client";

import { ScrollTo } from "react-scroll-to";
import InstantMessages from "./InstantMessages";
import InstantChatInput from "./InstantChatInput";

// No need for InstantChatProvider here as it's now in the layout
const InstantChat = () => {
  return (
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
  );
};

export default InstantChat;
