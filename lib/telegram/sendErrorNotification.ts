import { sendMessage } from "./sendMessage";
import { Message } from "ai";
import { SerializedError } from "../errors/serializeError";

export interface ErrorContext {
  email?: string;
  roomId?: string;
  messages?: Message[];
  path: string;
  error: SerializedError;
}

// Utility to escape Telegram Markdown special characters
function escapeTelegramMarkdown(text: string): string {
  // Escape characters for MarkdownV2: _ * [ ] ( ) ~ ` > # + - = | { } . !
  // For Markdown, only _, *, [, ], (, ), ~, `, >, #, +, -, =, |, {, }, ., ! need escaping
  // But for our use, let's escape the most common troublemakers: _, *, [, ], (, ), ~, `, >, #, +, -, =, |, {, }, ., !
  return text.replace(/[\_\*\[\]\(\)~`>#+\-=|{}.!]/g, (match) => `\\${match}`);
}

/**
 * Formats error message for Telegram notification
 */
function formatErrorMessage({
  error,
  email = "unknown",
  roomId = "new chat",
  path,
  messages,
}: ErrorContext): string {
  const timestamp = new Date().toISOString();

  let message = `❌ Error Alert\n`;
  message += `From: ${email}\n`;
  message += `Room ID: ${roomId}\n`;
  message += `Time: ${timestamp}\n\n`;

  message += `Error Message:\n${error.message}\n\n`;

  if (error.name) {
    message += `Error Type: ${error.name}\n\n`;
  }

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

  // Escape for Telegram Markdown
  return escapeTelegramMarkdown(message);
}

/**
 * Sends error notification to Telegram
 * Non-blocking to avoid impacting API operations
 */
export async function sendErrorNotification(
  params: ErrorContext
): Promise<void> {
  try {
    const message = formatErrorMessage(params);
    await sendMessage(message, { parse_mode: "Markdown" }).catch((err) => {
      console.error("Failed to send error notification:", err);
    });
  } catch (err) {
    console.error("Error in sendErrorNotification:", err);
  }
}
