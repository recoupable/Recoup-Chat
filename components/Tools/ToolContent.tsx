import FanTable from "./FanTable";
import Artist from "./Artist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import Campaign from "./Campaign";

const ToolContent = () => {
  const { toolName } = useToolCallProvider();

  return (
    <div>
      {toolName === "getCampaign" && <FanTable />}
      {(toolName === "createArtist" || toolName === "getArtists") && <Artist />}
      {toolName === "createCampaign" && <Campaign />}
    </div>
  );
};

export default ToolContent;
