import { experimental_createMCPClient, Message, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import createMemories from "@/lib/supabase/createMemories";
import getSegmentFansTool from "@/lib/tools/getSegmentFans";
import { DESCRIPTION } from "@/lib/consts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as Message[];
    const room_id = body.roomId;
    const segment_id = body.segmentId;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      throw new Error("No messages provided");
    }

    if (room_id) {
      await createMemories({
        room_id,
        content: lastMessage,
      });
    }
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

    let fanSegmentTool;
    if (segment_id) {
      fanSegmentTool = getSegmentFansTool(segment_id);
      // @ts-expect-error no fanSegmentTool
      tools.fanSegmentTool = fanSegmentTool;
    }

    const streamTextOpts = {
      model: anthropic("claude-3-7-sonnet-20250219"),
      system: DESCRIPTION,
      messages,
      providerOptions: {
        anthropic: {
          thinking: { type: "enabled", budgetTokens: 12000 },
        },
      },
      tools,
      maxSteps: 11,
      toolCallStreaming: true,
    };

    const result = streamText(streamTextOpts);

    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error("[Chat] Error processing request:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
