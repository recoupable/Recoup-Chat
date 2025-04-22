import { sendMessage } from "./sendMessage";
import { Message } from "ai";
import { formatErrorForTelegram } from "./errorFormatter";
import { trimMessage } from "./trimMessage";

export interface ErrorContext {
  email?: string;
  roomId?: string;
  messages?: Message[];
  path?: string;
  [key: string]: unknown; // Allow additional context properties
}

interface ErrorNotificationParams extends ErrorContext {
  error: unknown; // Accept any error type, not just Error objects
}

/**
 * Formats error message for Telegram notification with improved error serialization
 */
function formatErrorMessage({
  error,
  email = "unknown",
  roomId = "new chat",
  path,
  messages,
  ...additionalContext
}: ErrorNotificationParams): string {
  const timestamp = new Date().toISOString();

  let message = `❌ Error Alert\n`;
  message += `From: ${email}\n`;
  message += `Room ID: ${roomId}\n`;
  message += `Time: ${timestamp}\n\n`;

  // Format the error object properly using our utility
  message += `${formatErrorForTelegram(error)}\n\n`;

  if (path) {
    message += `API Path: ${path}\n\n`;
  }

  // Include any additional context that might be helpful
  if (Object.keys(additionalContext).length > 0) {
    message += "Additional Context:\n";
    for (const [key, value] of Object.entries(additionalContext)) {
      if (value !== undefined && key !== "error") {
        message += `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}\n`;
      }
    }
    message += "\n";
  }

  // Include the last message if available
  if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content) {
      message += `Last Message:\n${lastMessage.content}`;
    }
  }

  // Ensure the message is properly trimmed and sanitized for Telegram
  return trimMessage(message);
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
