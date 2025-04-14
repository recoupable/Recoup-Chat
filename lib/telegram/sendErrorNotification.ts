import { sendMessage } from "./sendMessage";
import { Message } from "ai";

interface ErrorNotificationParams {
  error: Error;
  context?: {
    userId?: string;
    requestParams?: {
      email?: string;
      roomId?: string;
      messages?: Message[];
      [key: string]: unknown;
    };
    path?: string;
  };
}

/**
 * Formats error message for Telegram notification
 */
function formatErrorMessage({
  error,
  context,
}: ErrorNotificationParams): string {
  const timestamp = new Date().toISOString();
  const email = context?.requestParams?.email || "unknown";
  const chatId = context?.requestParams?.roomId || "unknown";

  let message = `❌ Error Alert\n`;
  message += `From: ${email}\n`;
  message += `Chat ID: ${chatId}\n`;
  message += `Time: ${timestamp}\n\n`;

  message += `Error Message:\n${error.message}\n\n`;

  if (context?.path) {
    message += `API Path: ${context.path}\n\n`;
  }

  if (error.stack) {
    // Include more of the stack trace but still limit it
    const stackLines = error.stack.split("\n").slice(0, 8);
    message += `Stack Trace:\n\`\`\`\n${stackLines.join("\n")}\n\`\`\`\n`;
  }

  const messages = context?.requestParams?.messages;
  if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content) {
      message += `\nLast Message:\n${lastMessage.content}`;
    }
  }

  return message;
}

/**
 * Sends error notification to Telegram
 * Non-blocking to avoid impacting API operations
 */
export async function sendErrorNotification(
  params: ErrorNotificationParams
): Promise<void> {
  try {
    const message = formatErrorMessage(params);
    // Re-enable Markdown parsing for code blocks
    await sendMessage(message, { parse_mode: "Markdown" }).catch((err) => {
      console.error("Failed to send error notification:", err);
    });
  } catch (err) {
    // Catch any errors in the error handling itself to prevent cascading issues
    console.error("Error in sendErrorNotification:", err);
  }
}
