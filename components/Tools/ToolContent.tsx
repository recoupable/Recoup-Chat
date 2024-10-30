import FanTable from "./FanTable";
import Artist from "./Artist";

interface ToolContentProps {
  toolName: string | undefined;
  context: Record<string, unknown>;
  question: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fans: Array<any>;
  scroll: () => void;
}

const ToolContent = ({
  toolName,
  context,
  fans,
  scroll,
  question,
}: ToolContentProps) => (
  <div>
    {toolName === "getCampaign" && <FanTable fans={fans} scroll={scroll} />}
    {(toolName === "createArtist" ||
      toolName === "getArtists" ||
      toolName === "getArtistAnalysis") && (
      <Artist context={context} scroll={scroll} question={question} />
    )}
  </div>
);

export default ToolContent;
