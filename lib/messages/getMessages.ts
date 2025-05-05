import { Message } from "ai";
import generateUUID from "@/lib/generateUUID";

/**
 * Converts a string message to an array of properly formatted message objects
 * Can be used to generate initial messages for chat components
 *
 * @param content The text content of the message
 * @param role The role of the message sender (default: "user")
 * @returns An array of properly formatted message objects
 */
export function getMessages(
  content: string,
  role: "user" | "assistant" = "user"
): Message[] {
  if (!content) {
    return [];
  }

  return [
    {
      id: generateUUID(),
      role,
      content,
    },
  ];
}
