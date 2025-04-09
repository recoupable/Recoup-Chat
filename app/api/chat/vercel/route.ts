import { myProvider } from "@/lib/models";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import createMemories from "@/lib/supabase/createMemories";
import { Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { validateMessages } from "@/lib/chat/validateMessages";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";

export async function POST(request: NextRequest) {
  const {
    messages,
    roomId,
    artistId,
  }: {
    messages: Array<Message>;
    roomId?: string;
    artistId?: string;
  } = await request.json();
  const selectedModelId = "sonnet-3.7";
  const system = await getSystemPrompt({ roomId, artistId });

  if (roomId) {
    const { lastMessage } = validateMessages(messages);
    await createMemories({
      room_id: roomId,
      content: lastMessage,
    });
  }

  const tools = await getMcpTools();

  const stream = streamText({
    system,
    tools,
    model: myProvider.languageModel(selectedModelId),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages,
    maxSteps: 11,
    toolCallStreaming: true,
  });

  return stream.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: () => {
      return `An error occurred, please try again!`;
    },
  });
}
