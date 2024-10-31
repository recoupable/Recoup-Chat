import FanTable from "./FanTable";
import Artist from "./Artist";
import { useToolCallProvider } from "@/providers/ToolCallProvider";

const ToolContent = () => {
  const { toolName } = useToolCallProvider();

  return (
    <div>
      {toolName === "getCampaign" && <FanTable />}
      {(toolName === "createArtist" || toolName === "getArtists") && <Artist />}
    </div>
  );
};

export default ToolContent;
