import { Message } from "ai";

export function validateMessages(messages: Message[]) {
  if (!messages.length) {
    throw new Error("No messages provided");
  }

  return {
    lastMessage: messages[messages.length - 1],
    validMessages: messages.filter((m) => m.content.length > 0),
  };
}
