import FanTable from "./FanTable";
import Artist from "./Artist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import Campaign from "./Campaign";

const ToolContent = () => {
  const { toolName } = useToolCallProvider();

  return (
    <div>
      {toolName === "getCampaign" && <FanTable />}
      {(toolName === "createArtist" ||
        toolName === "getArtists" ||
        toolName === "getArtistAnalysis") && <Artist />}
      {(toolName === "createCampaign" || toolName === "getCampaigns") && (
        <Campaign />
      )}
    </div>
  );
};

export default ToolContent;
