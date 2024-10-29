import FanTable from "./FanTable";
import Artist from "./Artist";

interface ContentProps {
  toolName: string | undefined;
  context: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fans: Array<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artists: Array<any>;
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}

const Content = ({
  toolName,
  context,
  fans,
  artists,
  scroll,
}: ContentProps) => (
  <div>
    {toolName === "getCampaign" && <FanTable fans={fans} scroll={scroll} />}
    {(toolName === "createArtist" || toolName === "getArtists") && (
      <Artist context={context} srcoll={scroll} artists={artists} />
    )}
  </div>
);

export default Content;
