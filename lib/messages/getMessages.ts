import { Message } from "ai";
import generateUUID from "@/lib/generateUUID";

/**
 * Converts a string message to an array of properly formatted message objects
 * Can be used to generate initial messages for chat components
 *
 * @param content The text content of the message
 * @returns An array of properly formatted message objects
 */
export function getMessages(content?: string): Message[] {
  if (!content) {
    return [];
  }

  return [
    {
      id: generateUUID(),
      role: "user",
      content,
    },
  ];
}
