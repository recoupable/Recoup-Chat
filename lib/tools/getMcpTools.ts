import { experimental_createMCPClient } from "ai";
import getSegmentFansTool from "./getSegmentFans";

export async function getMcpTools(segment_id?: string) {
  const braveMcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: process.env.BRAVE_MCP_SERVER as string,
    },
  });

  const toolSetBraveWebSearch = await braveMcpClient.tools();
  const tools = {
    ...toolSetBraveWebSearch,
  };

  if (segment_id) {
    const fanSegmentTool = getSegmentFansTool(segment_id);
    // @ts-expect-error no fanSegmentTool
    tools.fanSegmentTool = fanSegmentTool;
  }

  return tools;
}
