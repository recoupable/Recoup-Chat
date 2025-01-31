import { useArtistProvider } from "@/providers/ArtistProvider";
import { useChatProvider } from "@/providers/ChatProvider";
import { ArrowUpRightIcon } from "lucide-react";
import { v4 as uuidV4 } from "uuid";

const SuggestionPill = ({ suggestion }: { suggestion: string }) => {
  const { append } = useChatProvider();
  const { selectedArtist } = useArtistProvider();

  return (
    <button
      type="button"
      className="min-w-[200px] min-h-[66px] border border-grey py-2 px-4 rounded-xl flex gap-1 items-center justify-center text-xs transition-colors hover:bg-grey"
      onClick={() =>
        append({
          id: uuidV4(),
          role: "user",
          content: suggestion,
        })
      }
    >
      <div
        className="text-center"
        dangerouslySetInnerHTML={{
          __html: suggestion.replaceAll(
            selectedArtist?.artist.name || "",
            `<span style="color:#aa7fdb;">${selectedArtist?.artist.name || ""}</span>`,
          ),
        }}
      />
      <ArrowUpRightIcon className="w-4 h-4 flex-shrink-0" />
    </button>
  );
};

export default SuggestionPill;
