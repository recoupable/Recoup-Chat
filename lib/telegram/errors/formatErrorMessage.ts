import { escapeTelegramMarkdown } from "./escapeTelegramMarkdown";
import type { ErrorContext } from "@/lib/errors/handleError";

/**
 * Formats error message for Telegram notification using unified ErrorContext.
 * @param context - Unified error context object  
 * @returns Escaped, formatted error message string
 */
export function formatErrorMessage(
  context: ErrorContext & { error: NonNullable<ErrorContext['error']> }
): string {
  const {
    error,
    email = "unknown",
    roomId = "new chat", 
    path = "unknown",
    messages,
  } = context;
  
  const timestamp = new Date().toISOString();

  let message = `❌ Error Alert\n`;
  message += `From: ${email}\n`;
  message += `Room ID: ${roomId}\n`;
  message += `Path: ${path}\n`;
  message += `Time: ${timestamp}\n\n`;

  message += `Error Message:\n${error.message}\n\n`;

  if (error.name) {
    message += `Error Type: ${error.name}\n\n`;
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

  return escapeTelegramMarkdown(message);
}
