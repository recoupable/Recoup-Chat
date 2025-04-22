import { experimental_createMCPClient, ToolSet } from "ai";

/**
 * Fetches and filters Perplexity tools, excluding the problematic perplexity_reason tool
 * @returns An object containing only the perplexity_ask tool
 */
export async function getPerplexityTools() {
  try {
    const perplexityMcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: process.env.PERPLEXITY_MCP_SERVER as string,
      },
    });

    const allPerplexityTools = await perplexityMcpClient.tools();

    // Extract only the perplexity_ask tool, filtering out perplexity_reason
    const { perplexity_ask } = allPerplexityTools;

    return { perplexity_ask } as ToolSet;
  } catch (error) {
    console.error("Failed to fetch Perplexity tools:", error);
    return {};
  }
}
