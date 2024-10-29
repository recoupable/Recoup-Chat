import FanTable from "./FanTable";
import InputArtist from "./InputArtist";

interface ContentProps {
  toolName: string | undefined;
  context: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fans: Array<any>;
  scroll: () => void;
}

const Content = ({ toolName, context, fans, scroll }: ContentProps) => (
  <div>
    {toolName === "getCampaign" && <FanTable fans={fans} scroll={scroll} />}
    {toolName === "createArtist" && <InputArtist context={context} />}
  </div>
);

export default Content;
