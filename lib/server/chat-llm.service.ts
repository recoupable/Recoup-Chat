import "server-only";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import OpenAI from "openai";

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
    await chatMessagesService.getChatSettings(
      lastMessage.content,
      email,
      artistId,
      chatContext,
    );

    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: "o3-mini",
      stream: true,
      messages: messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }
}
