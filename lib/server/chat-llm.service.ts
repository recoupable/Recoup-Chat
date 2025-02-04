import "server-only";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import OpenAI from "openai";

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
  email: z.string(),
  artistId: z.string(),
  context: z.string(),
});

export function createChatLLMService() {
  return new ChatLLMService();
}

class ChatLLMService {
  constructor() {}
  async streamResponse({
    messages,
    email,
    artistId,
    context,
  }: z.infer<typeof StreamResponseSchema>) {
    const chatMessagesService = createChatMessagesService();
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

    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      stream: true,
      messages: [
        ...messages,
        {
          role: "assistant",
          content: settings.systemMessage,
        },
      ],
      // eslint-disable-next-line
      tools: settings.tools as any,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }
}
