import { Message, streamText, Tool } from "ai";
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

    const streamTextOpts = {
      model: anthropic("claude-3-7-sonnet-20250219"),
      system: DESCRIPTION,
      messages,
      providerOptions: {
        anthropic: {
          thinking: { type: "enabled", budgetTokens: 12000 },
        },
      },
      maxSteps: 11,
      toolCallStreaming: true,
    };

    if (segment_id) {
      const fanSegmentTool = getSegmentFansTool(segment_id);
      const tools = [fanSegmentTool] as Tool[];
      // @ts-expect-error tools type
      streamTextOpts.tools = tools;
    }

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
