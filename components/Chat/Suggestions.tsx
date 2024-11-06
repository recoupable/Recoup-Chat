import { useChatProvider } from "@/providers/ChatProvider";
import { ArrowUpRightIcon } from "lucide-react";
import { v4 as uuidV4 } from "uuid";
import { useEffect, useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";

const Suggestions = () => {
  const { append, suggestions } = useChatProvider();
  const [maxWidth, setMaxWidth] = useState<string>("auto");
  const { selectedArtist } = useArtistProvider();

  // Take only the first two suggestions
  const limitedSuggestions = suggestions.slice(0, 2);

  useEffect(() => {
    // Create a temporary span to measure text width
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.fontSize = "14px"; // match text-sm
    document.body.appendChild(span);

    // Find the longest text width
    let maxTextWidth = 0;
    limitedSuggestions.forEach((suggestion) => {
      span.textContent = suggestion;
      maxTextWidth = Math.max(maxTextWidth, span.offsetWidth);
    });

    // Clean up
    document.body.removeChild(span);

    // Add padding and icon width to the total
    setMaxWidth(`${maxTextWidth + 48}px`); // 24px for padding + 16px for icon + 8px for gap
  }, [limitedSuggestions]);

  return (
    <div className="max-w-3xl mx-auto w-full px-2 mt-4 flex gap-3 justify-center">
      {limitedSuggestions.map((suggestion: string) => (
        <button
          key={suggestion}
          type="button"
          style={{ width: maxWidth }}
          className="border border-gray-700 py-1 px-3 rounded-md flex gap-1 items-center justify-between text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() =>
            append({
              id: uuidV4(),
              role: "user",
              content: suggestion,
            })
          }
        >
          <div
            className="text-left"
            dangerouslySetInnerHTML={{
              __html: suggestion.replaceAll(
                selectedArtist?.name || "",
                `<span style="color:#aa7fdb;">${selectedArtist?.name || ""}</span>`,
              ),
            }}
          />
          <ArrowUpRightIcon className="w-4 h-4 flex-shrink-0" />
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
