import { experimental_createMCPClient } from "ai";
import getSegmentFansTool from "./getSegmentFans";

export async function getMcpTools(segment_id?: string) {
  const tavilyMcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: process.env.TAVILY_MCP_SERVER as string,
    },
  });

  const toolSetTavily = await tavilyMcpClient.tools();
  const tools = {
    ...toolSetTavily,
  };

  if (segment_id) {
    const fanSegmentTool = getSegmentFansTool(segment_id);
    // @ts-expect-error no fanSegmentTool
    tools.fanSegmentTool = fanSegmentTool;
  }

  return tools;
}
