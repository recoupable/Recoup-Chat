import { experimental_createMCPClient } from "ai";
import getSegmentFansTool from "./getSegmentFans";
import contactTeam from "./contactTeam";

export async function getMcpTools(segment_id?: string) {
  const perplexityMcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: process.env.PERPLEXITY_MCP_SERVER as string,
    },
  });

  const mantleMcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "https://next-mcp.vercel.app/sse",
    },
  });

  const toolSetPerplexityWebSearch = await perplexityMcpClient.tools();
  const toolSetMantleWebSearch = await mantleMcpClient.tools();
  const tools = {
    ...toolSetPerplexityWebSearch,
    ...toolSetMantleWebSearch,
    contactTeam,
  };

  if (segment_id) {
    const fanSegmentTool = getSegmentFansTool(segment_id);
    // @ts-expect-error no fanSegmentTool
    tools.fanSegmentTool = fanSegmentTool;
  }

  return tools;
}
