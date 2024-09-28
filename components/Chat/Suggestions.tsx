import { ArrowUpRightIcon } from "lucide-react";

const Suggestions = () => (
  <div className="flex flex-wrap justify-center gap-2">
    <button
      className="bubble-prompt px-3 py-1 bg-[#00309A] border border-white rounded-full text-[10px] sm:text-xs transition-all duration-150 ease-in-out flex items-center font-normal"
      aria-label="Ask about Billboard #1 song"
    >
      What is the Billboard #1 song?
      <ArrowUpRightIcon className="w-2 h-2 ml-1" aria-hidden="true" />
    </button>
    <button
      className="bubble-prompt px-3 py-1 bg-[#00309A] border border-white rounded-full text-[10px] sm:text-xs transition-all duration-150 ease-in-out flex items-center font-normal"
      aria-label="Ask about TikTok trends"
    >
      What&apos;s trending with fans on TikTok?
      <ArrowUpRightIcon className="w-2 h-2 ml-1" aria-hidden="true" />
    </button>
  </div>
);

export default Suggestions;
