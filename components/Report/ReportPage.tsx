"use client";

import ChatInput from "../Chat/ChatInput";
import Messages from "../Chat/Messages";
import { ScrollTo } from "react-scroll-to";
import SegmentReport from "./SegmentReport";

const ReportPage = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center bg-white rounded-xl overflow-hidden flex flex-col px-4 pb-5 md:pt-[14px]">
      <ScrollTo>
        {({ scroll }) => (
          <Messages scroll={scroll}>
            <SegmentReport />
          </Messages>
        )}
      </ScrollTo>
      <ChatInput />
    </div>
  );
};

export default ReportPage;
