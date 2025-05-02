import {
  ErrorContext,
  sendErrorNotification,
} from "../telegram/sendErrorNotification";

/**
 * Standardized error notification helper
 * @param error The error that occurred
 * @param context Error context including user info and request details
 * @returns Promise that resolves when notification is sent
 */
export async function notifyError(context: ErrorContext) {
  return sendErrorNotification({
    ...context,
  }).catch((err) => {
    console.error("Failed to send error notification:", err);
  });
}
