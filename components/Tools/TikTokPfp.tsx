import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TikTokPfp = () => {
  const { loading, answer } = useToolCallProvider();
  const { funnelTrends } = useFunnelReportProvider();

  return (
    <div>
      {funnelTrends?.length && (
        <>
          {loading && !answer && (
            <p className="text-sm">{`Searching for @${funnelTrends[0].username} videos on tiktok...`}</p>
          )}
          <fieldset className="flex flex-col gap-2 py-2 items-center w-fit">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={funnelTrends[0].pfp}
                width={40}
                height={40}
                alt="not found pfp"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                window.open(`${funnelTrends[0].profileUrl}`, "_blank")
              }
              className="text-sm border-[1px] border-grey rounded-md px-3 py-1"
            >
              View on TikTok
            </button>
          </fieldset>
        </>
      )}
    </div>
  );
};

export default TikTokPfp;
