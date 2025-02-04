import "server-only";

import { openai } from "@ai-sdk/openai";
import { CoreTool, LanguageModelV1, streamText } from "ai";
import { z } from "zod";
import { createChatMessagesService } from "./chat-messages.service";

export const ChatMessagesSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string(),
      role: z.enum(["user", "assistant"]),
    }),
  ),
});

export const StreamResponseSchema = ChatMessagesSchema.extend({
  email: z.string(),
  artistId: z.string(),
  context: z.string(),
});

/**
 * @name createChatLLMService
 * @description Create a new instance of the ChatLLMService.
 */
export function createChatLLMService() {
  return new ChatLLMService();
}

/**
 * @name ChatLLMService
 * @description Chat service that uses the LLM model to generate responses.
 */
class ChatLLMService {
  constructor() {}

  /**
   * @name streamResponse
   * @description Stream a response to the user and store the messages in the database.
   */
  async streamResponse({
    messages,
    email,
    artistId,
    context,
  }: z.infer<typeof StreamResponseSchema>) {
    // use a normal service instance using the current user RLS
    const chatMessagesService = createChatMessagesService();

    // get the last message
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) {
      throw new Error("No messages provided");
    }

    const chatContext =
      messages.length > 2
        ? context || messages[messages.length - 2].content
        : context;
    const settings = await chatMessagesService.getChatSettings(
      lastMessage.content,
      email,
      artistId,
      chatContext,
    );
    const tools = settings.tools;

    const result = await streamText({
      model: openai(settings.model) as LanguageModelV1,
      system: settings.systemMessage,
      maxTokens: settings.maxTokens,
      temperature: 0.7,
      messages,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: tools as Record<string, CoreTool<any, any>> | undefined,
    });

    return result.toDataStreamResponse();
  }
}
