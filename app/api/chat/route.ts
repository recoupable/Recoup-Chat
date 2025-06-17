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
import attachRichFiles from "@/lib/chat/attachRichFiles";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { sanitizeEmptyMessages } from "@/lib/messages/filterEmptyMessages";
import { deleteMemoriesByRoomId } from "@/lib/supabase/deleteMemoriesByRoomId";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    messages: rawMessages,
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

    // Replace empty message content with invisible placeholder to prevent API errors
    const messages = sanitizeEmptyMessages(rawMessages);

    validateMessages(messages);

    // Attach files like PDFs and images
    const messagesWithRichFiles = await attachRichFiles(messages, {
      artistId: artistId as string,
    });

    const [tools, system] = await Promise.all([
      getMcpTools(),
      getSystemPrompt({
        roomId,
        artistId,
        accountId,
        email,
        conversationName: undefined, // Will be set in onFinish
      }),
    ]);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedModelId),
          system,
          abortSignal: request.signal,
          messages: messagesWithRichFiles,
          maxSteps: 111,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools,
          onChunk: (chunk) => {
            console.log("[[onChunk]]", chunk);
          },
          onFinish: async ({ response }) => {
            console.log("[[onFinish]]");
            try {
              const room = await getRoom(roomId);

              if (!room) {
                // --- NEW CHAT LOGIC ---
                // This block runs only on the first successful message of a new chat.
                // It creates the room and saves the entire conversation history from the client.

                // 1. Create the room and send notifications
                const conversationName = await generateChatTitle(
                  messages[0].content
                );
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

                // 2. Save the ENTIRE conversation history to the new room
                const completeConversation = appendResponseMessages({
                  messages, // The full, ordered array from the client
                  responseMessages: response.messages,
                });

                for (const message of completeConversation) {
                  await createMemories({
                    id: message.id,
                    room_id: roomId,
                    content: filterMessageContentForMemories(message),
                  });
                }
              } else {
                // --- EXISTING CHAT LOGIC (DELETE AND REPLACE) ---
                // This block runs for all subsequent messages in an existing chat.
                // It replaces the entire history to ensure perfect state synchronization.

                // 1. Construct the full, correct conversation history
                const completeConversation = appendResponseMessages({
                  messages, // The full, ordered array from the client
                  responseMessages: response.messages,
                });

                // 2. Delete all existing messages for this room
                await deleteMemoriesByRoomId(roomId);

                // 3. Sequentially insert the new, complete conversation history
                for (const message of completeConversation) {
                  await createMemories({
                    id: message.id,
                    room_id: roomId,
                    content: filterMessageContentForMemories(message),
                  });
                }
              }
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
