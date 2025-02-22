import { Message } from "@ai-sdk/react";
import { ChatOpenAI } from "@langchain/openai";
import { formatPrompt } from "@/lib/chat/prompts";
import createMemories from "@/lib/supabase/createMemories";
import { AI_MODEL } from "@/lib/consts";
import { LangChainAdapter } from "ai";

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

  const formattedPrompt = await formatPrompt(
    context,
    question,
    lastMessage.content
  );

  const model = new ChatOpenAI({
    modelName: AI_MODEL,
    streaming: true,
  });

  const stream = await model.stream(formattedPrompt);

  return LangChainAdapter.toDataStreamResponse(stream);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
