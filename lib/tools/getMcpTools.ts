import { experimental_createMCPClient } from "ai";
import getSegmentFansTool from "./getSegmentFans";

export async function getMcpTools(segment_id?: string) {
  const perplexityMcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: process.env.PERPLEXITY_MCP_SERVER as string,
    },
  });

  const toolSetPerplexityWebSearch = await perplexityMcpClient.tools();
  const tools = {
    ...toolSetPerplexityWebSearch,
  };

  if (segment_id) {
    const fanSegmentTool = getSegmentFansTool(segment_id);
    // @ts-expect-error no fanSegmentTool
    tools.fanSegmentTool = fanSegmentTool;
  }

  return tools;
}
