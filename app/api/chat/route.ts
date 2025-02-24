import { Message } from "@ai-sdk/react";
import createMemories from "@/lib/supabase/createMemories";
import { LangChainAdapter } from "ai";
import initializeAgent from "@/lib/agent/initializeAgent";
import { HumanMessage } from "@langchain/core/messages";

// Define types for the agent message structure
type AgentMessage = {
  content: string;
  [key: string]: unknown;
};

type AgentChunk = {
  agent?: {
    messages: AgentMessage[];
  };
  tools?: {
    messages: AgentMessage[];
  };
};

export async function POST(req: Request) {
  try {
    console.debug("[Chat] Processing incoming request...");
    const body = await req.json();
    const messages = body.messages as Message[];
    const artist_id = body.artistId;
    const room_id = body.roomId;

    console.debug("[Chat] Request details:", {
      messageCount: messages.length,
      artist_id,
      room_id,
    });

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) {
      console.error("[Chat] No messages provided");
      throw new Error("No messages provided");
    }

    const question = lastMessage.content;
    console.debug("[Chat] Processing question:", question);

    if (room_id) {
      console.debug("[Chat] Creating memory for room:", room_id);
      await createMemories({
        room_id,
        artist_id,
        content: lastMessage,
      });
    }

    console.debug("[Chat] Initializing agent...");
    const { agent } = await initializeAgent({
      threadId: room_id || "default",
    });

    console.debug("[Chat] Creating message structure...");
    const messageInput = {
      messages: [new HumanMessage(question)],
    };
    console.debug("[Chat] Message structure created:", messageInput);

    console.debug("[Chat] Starting agent stream...");
    const stream = await agent.stream(messageInput);

    // Create transform stream to extract content from agent messages
    const transformStream = new TransformStream<AgentChunk, string>({
      async transform(chunk, controller) {
        console.debug("[Chat] Processing chunk:", chunk);
        let content: string | undefined;
        if ("agent" in chunk && chunk.agent?.messages?.[0]?.content) {
          content = chunk.agent.messages[0].content;
          console.debug("[Chat] Extracted content:", content);
        } else if ("tools" in chunk && chunk.tools?.messages?.[0]?.content) {
          content = chunk.tools.messages[0].content;
          console.debug("[Chat] Extracted tool content:", content);
        }
        if (content) {
          controller.enqueue(content);
        }
      },
    });

    // Pipe the agent stream through our transformer
    const transformedStream = stream.pipeThrough(transformStream);
    console.debug("[Chat] Stream transformed successfully");

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
