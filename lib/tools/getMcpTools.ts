import { experimental_createMCPClient } from "ai";
import getSegmentFans from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistComments from "./getArtistComments";
import getArtistSegments from "./getArtistSegments";
import getArtistSocials from "./getArtistSocials";
import { getPerplexityTools } from "./getPerplexityTools";

export async function getMcpTools() {
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
    get_artist_segments: getArtistSegments,
    get_artist_socials: getArtistSocials,
    get_segment_fans: getSegmentFans,
    ...toolSetMantleWebSearch,
    ...perplexityTools,
  };

  return tools;
}
