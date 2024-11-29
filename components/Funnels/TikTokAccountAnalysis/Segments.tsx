import { useChatProvider } from "@/providers/ChatProvider";
import { useTikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import { v4 as uuidV4 } from "uuid";

const Segments = () => {
  const { segments } = useTikTokAnalysisProvider();
  const { append } = useChatProvider();

  const handleGenerateReport = async () => {
    append(
      {
        id: uuidV4(),
        role: "user",
        content: `Please create a tiktok fan segment report summary.`,
      },
      "/funnels/tiktok-account-analysis/report",
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {segments
        .map((obj) => ({
          name: Object.keys(obj)[0],
          count: Object.values(obj)[0],
        }))
        .flat()
        .slice(0, 10)
        .map((segment) => (
          <button
            className="w-full border-grey-light border-[1px] rounded-md px-3 py-2 flex gap-2 items-center shadow-grey"
            type="button"
            key={segment.name}
            onClick={handleGenerateReport}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/segment.svg"}
              alt="not found logo"
              className="!w-5 !h-5"
            />
            <p className="font-bold text-xs text-center">
              {segment.name} {`(${segment.count})`}
            </p>
          </button>
        ))}
    </div>
  );
};

export default Segments;
