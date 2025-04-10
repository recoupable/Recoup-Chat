import { myProvider } from "@/lib/models";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import createMemories from "@/lib/supabase/createMemories";
import { Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { validateMessages } from "@/lib/chat/validateMessages";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import getRoom from "@/lib/supabase/getRoom";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import getAiTitle from "@/lib/getAiTitle";

export async function POST(request: NextRequest) {
  const {
    messages,
    roomId,
    artistId,
    accountId,
  }: {
    messages: Array<Message>;
    roomId: string;
    artistId?: string;
    accountId: string;
  } = await request.json();
  const selectedModelId = "sonnet-3.7";
  const system = await getSystemPrompt({ roomId, artistId });
  const room = await getRoom(roomId);

  if (!room) {
    const title = await getAiTitle(messages[0].content);

    await createRoomWithReport({
      account_id: accountId,
      topic: title,
      artist_id: artistId || undefined,
      chat_id: roomId || undefined,
    });
  }

  const { lastMessage } = validateMessages(messages);
  await createMemories({
    room_id: roomId,
    content: lastMessage,
  });

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
