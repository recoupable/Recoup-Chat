import { Message } from "ai";
import createMemories from "@/lib/supabase/createMemories";
import { DESCRIPTION } from "@/lib/consts";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { streamWithFailover } from "@/lib/chat/failover";

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

    const tools = await getMcpTools(segment_id);
    const system = artist_id
      ? `${DESCRIPTION} The active artist_account_id is ${artist_id}`
      : DESCRIPTION;

    const result = await streamWithFailover({
      messages,
      system,
      tools,
    });
    console.log("result", result);
    return result;
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

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
