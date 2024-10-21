import "server-only";

import { openai } from "@ai-sdk/openai";
import { CoreTool, LanguageModelV1, streamText } from "ai";
import { encodeChat } from "gpt-tokenizer";
import { z } from "zod";

import { createChatMessagesService } from "./chat-messages.service";
import { AI_MODEL } from "../consts";

export const ChatMessagesSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string(),
      role: z.enum(["user", "assistant"]),
    }),
  ),
});

export const StreamResponseSchema = ChatMessagesSchema.extend({
  accountId: z.string().uuid(),
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
  async streamResponse({ messages }: z.infer<typeof StreamResponseSchema>) {
    // use a normal service instance using the current user RLS
    const chatMessagesService = createChatMessagesService();

    // get the last message
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) {
      throw new Error("No messages provided");
    }

    // // make sure the user has enough credits
    // await this.assertEnoughCredits(accountId);

    // retrieve the chat settings
    const settings = await chatMessagesService.getChatSettings(
      lastMessage.content,
    );
    const systemMessage = settings.systemMessage;
    const maxTokens = settings.maxTokens;
    const tools = settings.tools;
    // we need to limit the history length so not to exceed the max tokens of the model
    // let's assume for simplicity that all models have a max tokens of 128000
    // so we need to make sure that the history doesn't exceed output length + system message length
    const maxModelTokens = 228000;

    const maxHistoryLength = maxModelTokens - systemMessage.length - maxTokens;
    let decodedHistory = encodeChat(messages, AI_MODEL);

    if (decodedHistory.length > maxHistoryLength) {
      while (decodedHistory.length > maxHistoryLength) {
        messages.shift();
        decodedHistory = encodeChat(messages, AI_MODEL);
      }
    }

    // we use the openai model to generate a response
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
