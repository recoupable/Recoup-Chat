import { experimental_createMCPClient } from "ai";
import getSegmentFansTool from "./getSegmentFans";

export async function getMcpTools(segment_id?: string) {
  let tools = {};

  try {
    const perplexityMcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: process.env.PERPLEXITY_MCP_SERVER as string,
      },
    });
    const toolSetPerplexityWebSearch = await perplexityMcpClient.tools();
    tools = { ...tools, ...toolSetPerplexityWebSearch };
  } catch (error) {
    console.error("[MCP] Perplexity client error:", error);
  }

  try {
    const mantleMcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "https://next-mcp.vercel.app/sse",
      },
    });
    const toolSetMantleWebSearch = await mantleMcpClient.tools();
    tools = { ...tools, ...toolSetMantleWebSearch };
  } catch (error) {
    console.error("[MCP] Mantle client error:", error);
  }

  if (segment_id) {
    const fanSegmentTool = getSegmentFansTool(segment_id);
    // @ts-expect-error no fanSegmentTool
    tools.fanSegmentTool = fanSegmentTool;
  }

  return tools;
}
