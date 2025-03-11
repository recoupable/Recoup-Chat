import { Message } from "@ai-sdk/react";
import createMemories from "@/lib/supabase/createMemories";
import { LangChainAdapter } from "ai";
import initializeAgent from "@/lib/agent/initializeAgent";
import { HumanMessage } from "@langchain/core/messages";
import getTransformedStream from "@/lib/agent/getTransformedStream";

// Cache for agent instances to avoid recreating them for the same room/segment
const agentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

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

    // Create a cache key based on room_id and segment_id
    const cacheKey = `${room_id || "default"}_${segment_id || ""}`;
    
    // Check if we have a cached agent
    let agentData = agentCache.get(cacheKey);
    
    // If no cached agent or cache expired, initialize a new one
    if (!agentData || Date.now() > agentData.expiry) {
      const { agent } = await initializeAgent({
        threadId: room_id || "default",
        segmentId: segment_id,
      });
      
      // Store in cache with expiry time
      agentData = {
        agent,
        expiry: Date.now() + CACHE_TTL
      };
      
      agentCache.set(cacheKey, agentData);
    }

    const messageInput = {
      messages: [new HumanMessage(question)],
    };

    // Use the cached or newly created agent
    const stream = await agentData.agent.stream(messageInput, {
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

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of agentCache.entries()) {
    if (now > value.expiry) {
      agentCache.delete(key);
    }
  }
}, CACHE_TTL);

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
