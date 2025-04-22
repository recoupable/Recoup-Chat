import { experimental_createMCPClient } from "ai";
import getSegmentFansTool from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistComments from "./getArtistComments";
import { getPerplexityTools } from "./getPerplexityTools";

export async function getMcpTools(segment_id?: string) {
  const perplexityTools = await getPerplexityTools();

  const mantleMcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "https://next-mcp.vercel.app/sse",
    },
  });

  const toolSetMantleWebSearch = await mantleMcpClient.tools();
  const tools = {
    contact_team: contactTeam,
    get_artist_comments: getArtistComments,
    ...toolSetMantleWebSearch,
    ...perplexityTools,
  };

  if (segment_id) {
    const fanSegmentTool = getSegmentFansTool(segment_id);
    // @ts-expect-error no fanSegmentTool
    tools.fanSegmentTool = fanSegmentTool;
  }

  return tools;
}
