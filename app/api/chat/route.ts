import { Message } from "@ai-sdk/react";
import createMemories from "@/lib/supabase/createMemories";
import { LangChainAdapter } from "ai";
import initializeAgent from "@/lib/agent/initializeAgent";
import { HumanMessage } from "@langchain/core/messages";
import getTransformedStream from "@/lib/agent/getTransformedStream";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as Message[];
    const artist_id = body.artistId;
    const room_id = body.roomId;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      throw new Error("No messages provided");
    }

    const question = lastMessage.content;
    if (room_id) {
      await createMemories({
        room_id,
        artist_id,
        content: lastMessage,
      });
    }

    const { agent } = await initializeAgent({
      threadId: room_id || "default",
    });

    const messageInput = {
      messages: [new HumanMessage(question)],
    };

    const stream = await agent.stream(messageInput);
    const transformedStream = getTransformedStream(stream);
    return LangChainAdapter.toDataStreamResponse(transformedStream);
  } catch (error) {
    console.error("[Chat] Error processing request:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
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
export const revalidate = 0;
export const fetchCache = "force-no-store";
