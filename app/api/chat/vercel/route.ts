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
import { sendErrorNotification } from "@/lib/telegram/sendErrorNotification";

export async function POST(request: NextRequest) {
  try {
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
        room_id: roomId,
        content: lastMessage,
      }),
      getSystemPrompt({
        roomId,
        artistId,
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
        sendErrorNotification({
          error: e instanceof Error ? e : new Error(String(e)),
          path: "/api/chat/vercel",
          chatId: roomId,
          email,
          lastMessage: messages[messages.length - 1],
        }).catch((err) => {
          console.error("Failed to send error notification:", err);
        });

        return "Oops, an error occurred!";
      },
    });
  } catch (e) {
    console.error("Global error in chat API:", e);
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      requestBody = {};
    }

    await sendErrorNotification({
      error: e instanceof Error ? e : new Error(String(e)),
      path: "/api/chat/vercel",
      chatId: requestBody.roomId,
      email: requestBody.email,
      lastMessage: requestBody.messages?.[requestBody.messages?.length - 1],
    }).catch((err) => {
      console.error("Failed to send error notification:", err);
    });

    return new Response(
      JSON.stringify({
        error: "An error occurred",
        message: "Oops, an error occurred!",
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
