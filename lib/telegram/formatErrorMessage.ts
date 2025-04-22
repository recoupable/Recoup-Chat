import { Message } from "ai";
import { trimMessage } from "./trimMessage";
import { safeStringify } from "./safeStringify";

export interface ErrorMessageParams {
  error: Error;
  email?: string;
  roomId?: string;
  path?: string;
  messages?: Message[];
}

/**
 * Formats error message for Telegram notification
 * Creates a structured message with error details for debugging
 */
export function formatErrorMessage({
  error,
  email = "unknown",
  roomId = "new chat",
  path,
  messages,
}: ErrorMessageParams): string {
  const timestamp = new Date().toISOString();

  let message = `❌ Error Alert\n`;
  message += `From: ${email}\n`;
  message += `Room ID: ${roomId}\n`;
  message += `Time: ${timestamp}\n\n`;

  // Use safeStringify for error message to prevent "[object Object]"
  message += `Error Message:\n${safeStringify(error.message)}\n\n`;

  if (path) {
    message += `API Path: ${path}\n\n`;
  }

  if (error.stack) {
    const stackLines = error.stack.split("\n").slice(0, 8);
    message += `Stack Trace:\n\`\`\`\n${stackLines.join("\n")}\n\`\`\`\n`;
  }

  if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content) {
      message += `\nLast Message:\n${lastMessage.content}`;
    }
  }

  // Ensure the message fits Telegram's limits
  return trimMessage(message);
}
