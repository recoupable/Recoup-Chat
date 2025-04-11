import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { getSystemPrompt } from "@/lib/prompts/getSystemPrompt";
import getRoom from "@/lib/supabase/getRoom";
import getAiTitle from "@/lib/getAiTitle";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import createMemories from "@/lib/supabase/createMemories";
import { ANTHROPIC_MODEL } from "@/lib/consts";
import { anthropic } from "@ai-sdk/anthropic";
import generateUUID from "@/lib/generateUUID";
import { CoreToolMessage, CoreAssistantMessage } from "ai";

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      accountId,
      artistId,
    }: {
      id: string;
      messages: Array<UIMessage>;
      accountId: string;
      artistId: string;
    } = await request.json();

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response("No user message found", { status: 400 });
    }

    const chat = await getRoom(id);

    if (!chat) {
      const title = await getAiTitle(userMessage.content);

      await createRoomWithReport({
        chat_id: id,
        account_id: accountId,
        artist_id: artistId,
        topic: title,
      });
    }

    await createMemories({
      room_id: id,
      content: userMessage.content,
    });

    const system = await getSystemPrompt({ roomId: id, artistId });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: anthropic(ANTHROPIC_MODEL),
          system,
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          onFinish: async ({ response }) => {
            if (accountId) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await createMemories({
                  room_id: id,
                  content: assistantMessage.content,
                });
              } catch (_) {
                console.error("Failed to save chat", _);
              }
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
      onError: () => {
        return "Oops, an error occurred!";
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("An error occurred while processing your request!", {
      status: 404,
    });
  }
}
