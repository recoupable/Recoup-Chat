import { Message } from "@ai-sdk/react";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { formatPrompt } from "@/lib/chat/prompts";
import createMemories from "@/lib/supabase/createMemories";
import { AI_MODEL } from "@/lib/consts";

type CoreMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages as Message[];
  const context = body.context;
  const artist_id = body.artistId;
  const room_id = body.roomId;

  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    throw new Error("No messages provided");
  }

  const question = lastMessage.content;

  if (room_id) {
    createMemories({
      room_id,
      artist_id,
      content: lastMessage,
    });
  }

  // Format messages using Langchain prompt template
  const formattedPrompt = await formatPrompt(
    context,
    question,
    lastMessage.content
  );

  // Convert Langchain messages to OpenAI format
  const formattedMessages: CoreMessage[] = formattedPrompt.map((msg) => ({
    role: msg.type === "human" ? "user" : msg.type,
    content: msg.content,
  }));

  // Stream the response
  const result = streamText({
    model: openai(AI_MODEL),
    messages: formattedMessages,
  });

  return result.toDataStreamResponse();
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
