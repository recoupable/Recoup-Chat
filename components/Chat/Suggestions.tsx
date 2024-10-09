import { SUGGESTIONS } from "@/lib/consts";
import { ArrowUpRightIcon } from "lucide-react";

const Suggestions = () => {
  return (
    <div className="max-w-3xl mx-auto w-full px-2 mt-2 flex gap-3 flex-wrap">
      {SUGGESTIONS.map((suggestion: string) => (
        <button
          key={suggestion}
          type="button"
          className="border border-gray-700 py-1 px-3 rounded-md flex gap-1 items-center text-sm"
        >
          {suggestion}
          <ArrowUpRightIcon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
