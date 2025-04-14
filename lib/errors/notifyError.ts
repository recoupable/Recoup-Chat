import {
  ErrorContext,
  sendErrorNotification,
} from "../telegram/sendErrorNotification";

/**
 * Creates a human-readable error message from any error type
 * @param error The error that occurred
 */
function createHumanReadableError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    // Handle object-type errors
    const errorObj = error as Record<string, unknown>;
    const message = errorObj.message || JSON.stringify(error, null, 2);
    const errorInstance = new Error(String(message));

    // Preserve the original error properties
    Object.assign(errorInstance, errorObj);
    return errorInstance;
  }

  return new Error(String(error));
}

/**
 * Standardized error notification helper
 * @param error The error that occurred
 * @param context Error context including user info and request details
 */
export async function notifyError(error: unknown, context: ErrorContext) {
  return sendErrorNotification({
    error: createHumanReadableError(error),
    ...context,
  }).catch((err) => {
    console.error("Failed to send error notification:", err);
  });
}
