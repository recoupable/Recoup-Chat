import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { ArtistToolResponse } from "@/types/Tool";

const Insights = () => {
  const { toolName, context, loading } = useToolCallProvider();

  return (
    <div>
      {toolName === "getArtistAnalysis" &&
        context.status === ArtistToolResponse.TIKTOK_TRENDS &&
        !loading && (
          <>
            <p className="text-sm mt-3">
              To create a new campaign for the next step, click the button
              below.
            </p>
            <button
              type="button"
              className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm mt-2"
            >
              Create a new campaign
            </button>
          </>
        )}
    </div>
  );
};

export default Insights;
