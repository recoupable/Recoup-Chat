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
import { sendNewConversationNotification } from "@/lib/telegram/sendNewConversationNotification";
import filterMessageContentForMemories from "@/lib/messages/filterMessageContentForMemories";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/sendErrorNotification";

export async function POST(request: NextRequest) {
  const body = await request.json();
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
  } = body;
  try {
    const selectedModelId = "sonnet-3.7";

    const [room, tools] = await Promise.all([getRoom(roomId), getMcpTools()]);
    let conversationName = room?.topic;

    if (!room) {
      conversationName = await generateChatTitle(messages[0].content);

      await Promise.all([
        createRoomWithReport({
          account_id: accountId,
          topic: conversationName,
          artist_id: artistId || undefined,
          chat_id: roomId || undefined,
        }),
        sendNewConversationNotification({
          email,
          conversationId: roomId,
          topic: conversationName,
          firstMessage: messages[0].content,
        }),
      ]);
    }

    const { lastMessage } = validateMessages(messages);

    const [, system] = await Promise.all([
      createMemories({
        id: lastMessage.id,
        room_id: roomId,
        content: filterMessageContentForMemories(lastMessage),
      }),
      getSystemPrompt({
        roomId,
        artistId,
        accountId,
        email,
        conversationName,
      }),
    ]);

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
                id: assistantMessage.id,
                room_id: roomId,
                content: filterMessageContentForMemories(assistantMessage),
              });
            } catch (_) {
              sendErrorNotification({
                ...body,
                error: serializeError(_),
              });
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
        sendErrorNotification({
          ...body,
          error: serializeError(e),
        });
        console.error("Error in chat API:", e);
        return JSON.stringify(serializeError(e));
      },
    });
  } catch (e) {
    sendErrorNotification({
      ...body,
      error: serializeError(e),
    });
    console.error("Global error in chat API:", e);
    return new Response(JSON.stringify(serializeError(e)), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
