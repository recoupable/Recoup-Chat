import { sendMessage } from "./sendMessage";

interface ErrorNotificationParams {
  error: Error;
  context?: {
    userId?: string;
    requestParams?: Record<string, unknown>;
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
  const environment = process.env.NODE_ENV || "unknown";

  let message = `🚨 *Server Error Alert*\n\n`;
  message += `*Environment:* ${environment}\n`;
  message += `*Timestamp:* ${timestamp}\n`;
  message += `*Error:* ${error.message}\n`;

  if (error.stack) {
    message += `*Stack:* \`\`\`${error.stack}\`\`\`\n`;
  }

  if (context) {
    if (context.userId) {
      message += `*User:* ${context.userId}\n`;
    }
    if (context.path) {
      message += `*Path:* ${context.path}\n`;
    }
    if (context.requestParams) {
      const paramsStr = JSON.stringify(context.requestParams, null, 2);
      message += `*Request Params:* \`\`\`${paramsStr}\`\`\`\n`;
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

    await sendMessage(message).catch((err) => {
      console.error("Failed to send Telegram error notification:", err);
    });
  } catch (err) {
    console.error("Error in sendErrorNotification:", err);
  }
}
