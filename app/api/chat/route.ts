import { Message } from "@ai-sdk/react";
import createMemories from "@/lib/supabase/createMemories";
import { LangChainAdapter } from "ai";
import initializeAgent from "@/lib/agent/initializeAgent";
import { HumanMessage } from "@langchain/core/messages";
import getTransformedStream from "@/lib/agent/getTransformedStream";
import { getServerMessages } from "@/lib/supabase/getServerMessages";
import { BaseMessage } from "@langchain/core/messages";

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

    const question = lastMessage.content;
    if (room_id) {
      await createMemories({
        room_id,
        content: lastMessage,
      });
    }

    const { agent } = await initializeAgent({
      threadId: room_id || "default",
      segmentId: segment_id,
    });

    let previousMessages: BaseMessage[] = [];
    if (room_id) {
      previousMessages = await getServerMessages(room_id, 10);
    }

    const currentMessage = new HumanMessage(question);
    
    const allMessages: BaseMessage[] = [...previousMessages, currentMessage];
    
    const messageInput = {
      messages: allMessages,
    };

    const stream = await agent.stream(messageInput, {
      configurable: {
        thread_id: room_id || "default",
        segmentId: segment_id,
      },
    });

    const transformedStream = getTransformedStream(stream);

    return LangChainAdapter.toDataStreamResponse(transformedStream);
  } catch (error) {
    console.error("[Chat] Error processing request:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
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
