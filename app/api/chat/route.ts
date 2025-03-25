import { Message, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import createMemories from "@/lib/supabase/createMemories";
import getLangchainMemories from "@/lib/agent/getLangchainMemories";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as Message[];
    const room_id = body.roomId;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      throw new Error("No messages provided");
    }

    // Save user message to memory if room_id exists
    if (room_id) {
      await createMemories({
        room_id,
        content: lastMessage,
      });
    }

    // Load previous messages for context if room_id exists
    let chatHistory: Message[] = [];
    if (room_id) {
      const previousMessages = await getLangchainMemories(room_id, 100);
      chatHistory = previousMessages.map((msg) => ({
        id: msg.id || crypto.randomUUID(),
        role: msg.getType() === "human" ? "user" : "assistant",
        content: String(msg.content),
      }));
    }

    // Prepare messages for the API call
    const apiMessages = [...chatHistory, ...messages];

    const result = streamText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      messages: apiMessages,
      providerOptions: {
        anthropic: {
          thinking: { type: "enabled", budgetTokens: 12000 },
        },
      },
      maxSteps: 11,
      toolCallStreaming: true,
    });

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
