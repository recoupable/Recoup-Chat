import { Message, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import createMemories from "@/lib/supabase/createMemories";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import getSystemPrompt from "@/lib/getSystemPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as Message[];
    const room_id = body.roomId;
    const segment_id = body.segmentId;
    const artist_id = body.artistId;

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

    // Get tools and system prompt
    const tools = await getMcpTools(segment_id);
    const systemPrompt = await getSystemPrompt(room_id);

    // Add active artist context if available
    const finalSystemPrompt = artist_id
      ? `${systemPrompt}
      
-----ACTIVE ARTIST-----
The active artist_account_id is ${artist_id}
-----END ACTIVE ARTIST-----`
      : systemPrompt;

    const streamTextOpts = {
      model: anthropic("claude-3-7-sonnet-20250219"),
      system: finalSystemPrompt,
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
    console.error("[chat]", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
