import { useChatProvider } from "@/providers/ChatProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { ArtistToolResponse } from "@/types/Tool";
import { v4 as uuidV4 } from "uuid";

const Insights = () => {
  const { toolName, context, loading } = useToolCallProvider();
  const { append } = useChatProvider();

  const handleSubmit = () => {
    append({
      id: uuidV4(),
      content: `Create a new campaign.`,
      role: "user",
    });
  };
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
              onClick={handleSubmit}
            >
              Create a new campaign
            </button>
          </>
        )}
    </div>
  );
};

export default Insights;
