import { useChatProvider } from "@/providers/ChatProvider";
import { ArrowUpRightIcon } from "lucide-react";
import { v4 as uuidV4 } from "uuid";

const Suggestions = () => {
  const { append, suggestions } = useChatProvider();

  return (
    <div className="max-w-3xl mx-auto w-full px-2 mt-2 flex gap-3 flex-wrap">
      {suggestions.map((suggestion: string) => (
        <button
          key={suggestion}
          type="button"
          className="border border-gray-700 py-1 px-3 rounded-md flex gap-1 items-center text-sm"
          onClick={() =>
            append({
              id: uuidV4(),
              role: "user",
              content: suggestion,
            })
          }
        >
          <p className="text-left">{suggestion}</p>
          <ArrowUpRightIcon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
