import { Message } from "ai";
import { sendMessage } from "@/lib/telegram/sendMessage";
import { SerializedError } from "@/lib/errors/serializeError";
import { formatErrorMessage } from "./formatErrorMessage";

export interface ErrorContext {
  email?: string;
  roomId?: string;
  messages?: Message[];
  path: string;
  error: SerializedError;
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
