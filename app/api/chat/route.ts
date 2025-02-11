import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import { AI_MODEL } from "@/lib/consts";
import getSystemMessage from "@/lib/chat/getSystemMessage";
import getTools from "@/lib/chat/getTools";
import createMemories from "@/lib/supabase/createMemories";

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;
  const context = body.context;
  const artist_id = body.artistId;
  const room_id = body.roomId;

  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    throw new Error("No messages provided");
  }

  const question = lastMessage.content;

  if (room_id)
    createMemories({
      room_id,
      artist_id,
      content: lastMessage,
    });

  const result = streamText({
    model: openai(AI_MODEL),
    messages: [
      ...messages,
      {
        role: "system",
        content: getSystemMessage(context, question),
      },
    ],
    tools: getTools(question),
  });

  return result.toDataStreamResponse();
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
