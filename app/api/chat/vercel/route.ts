import { myProvider } from "@/lib/models";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import createMemories from "@/lib/supabase/createMemories";
import {
  appendResponseMessages,
  createDataStreamResponse,
  Message,
  smoothStream,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { validateMessages } from "@/lib/chat/validateMessages";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import getRoom from "@/lib/supabase/getRoom";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import generateUUID from "@/lib/generateUUID";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";

export async function POST(request: NextRequest) {
  const {
    messages,
    roomId,
    artistId,
    accountId,
    email,
  }: {
    messages: Array<Message>;
    roomId: string;
    artistId?: string;
    accountId: string;
    email: string;
  } = await request.json();
  const selectedModelId = "sonnet-3.7";

  const room = await getRoom(roomId);
  let conversationName = room?.topic;

  if (!room) {
    conversationName = await generateChatTitle(messages[0].content);

    await createRoomWithReport({
      account_id: accountId,
      topic: conversationName,
      artist_id: artistId || undefined,
      chat_id: roomId || undefined,
    });
  }

  const system = await getSystemPrompt({
    roomId,
    artistId,
    email,
    conversationName,
  });

  const { lastMessage } = validateMessages(messages);
  await createMemories({
    room_id: roomId,
    content: lastMessage,
  });

  const tools = await getMcpTools();

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedModelId),
        system,
        messages,
        maxSteps: 11,
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateUUID,
        tools,
        onFinish: async ({ response }) => {
          try {
            const [, assistantMessage] = appendResponseMessages({
              messages: [lastMessage],
              responseMessages: response.messages,
            });

            await createMemories({
              room_id: roomId,
              content: assistantMessage,
            });
          } catch (_) {
            console.error("Failed to save chat", _);
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (e) => {
      console.error("Error in Vercel Chat", e);
      return "Oops, an error occurred!";
    },
  });
}
