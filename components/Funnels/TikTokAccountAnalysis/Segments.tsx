import Icon from "@/components/Icon";
import LucideIcon from "@/components/LucideIcon";
import { useChatProvider } from "@/providers/ChatProvider";
import { useTikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import { v4 as uuidV4 } from "uuid";

const Segments = () => {
  const { segments, result } = useTikTokAnalysisProvider();
  const { append } = useChatProvider();

  const handleGenerateReport = async (segmentName: string) => {
    append({
      id: uuidV4(),
      role: "user",
      content: `Please create a tiktok fan segment report for ${result.id} using this segment ${segmentName}.`,
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {segments.slice(0, 10).map((segment) => (
        <button
          className="w-full border-grey-light border-[1px] rounded-md px-3 py-2 flex gap-2 items-center shadow-grey"
          type="button"
          key={segment?.name}
          onClick={() => handleGenerateReport(segment?.name)}
        >
          {segment?.icon ? (
            <LucideIcon name={segment.icon} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <Icon name="logo-xs" />
          )}

          <p className="font-bold text-xs text-center">
            {segment?.name} {`(${segment?.count})`}
          </p>
        </button>
      ))}
    </div>
  );
};

export default Segments;
