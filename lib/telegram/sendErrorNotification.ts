import { sendMessage } from "./sendMessage";
import { Message } from "ai";

interface ErrorNotificationParams {
  error: Error;
  email?: string;
  roomId?: string;
  path?: string;
  messages?: Message[];
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
}: ErrorNotificationParams): string {
  const timestamp = new Date().toISOString();

  let message = `❌ Error Alert\n`;
  message += `From: ${email}\n`;
  message += `Room ID: ${roomId}\n`;
  message += `Time: ${timestamp}\n\n`;

  message += `Error Message:\n${error.message}\n\n`;

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
    await sendMessage(message, { parse_mode: "Markdown" }).catch((err) => {
      console.error("Failed to send error notification:", err);
    });
  } catch (err) {
    console.error("Error in sendErrorNotification:", err);
  }
}
