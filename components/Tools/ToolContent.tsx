import FanTable from "./FanTable";
import Artist from "./Artist";

interface ToolContentProps {
  toolName: string | undefined;
  context: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fans: Array<any>;
  scroll: () => void;
}

const ToolContent = ({ toolName, context, fans, scroll }: ToolContentProps) => (
  <div>
    {toolName === "getCampaign" && <FanTable fans={fans} scroll={scroll} />}
    {(toolName === "createArtist" || toolName === "getArtists") && (
      <Artist context={context} scroll={scroll} />
    )}
  </div>
);

export default ToolContent;
