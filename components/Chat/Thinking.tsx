import { LoaderCircle, TvMinimalPlay } from "lucide-react";

const Thinking = () => (
  <div className="mb-8">
    <div className="flex items-start gap-3">
      <TvMinimalPlay className="h-4 w-4 flex-shrink-0 text-gray-400 mt-1" />
      <div className="flex-1">
        <div className="inline-block text-[15px] leading-relaxed text-pretty break-words">
          <div className="flex items-center gap-2 text-gray-400">
            <p className="text-sm">is thinking...</p>
            <LoaderCircle className="h-3 w-3 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Thinking;
