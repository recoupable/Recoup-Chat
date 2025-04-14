import { Message } from "ai";
import { sendErrorNotification } from "../telegram/sendErrorNotification";

interface ErrorContext {
  email?: string;
  roomId?: string;
  lastMessage?: Message;
  path: string;
}

/**
 * Standardized error notification helper
 * @param error The error that occurred
 * @param context Error context including user info and request details
 */
export async function notifyError(error: unknown, context: ErrorContext) {
  return sendErrorNotification({
    error: error instanceof Error ? error : new Error(String(error)),
    ...context,
  }).catch((err) => {
    console.error("Failed to send error notification:", err);
  });
}
