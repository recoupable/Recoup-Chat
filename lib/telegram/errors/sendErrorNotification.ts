import { Message } from "ai";
import { sendMessage } from "@/lib/telegram/sendMessage";
import { SerializedError } from "@/lib/errors/serializeError";
import { formatErrorMessage } from "./formatErrorMessage";
import { insertErrorLog } from "@/lib/supabase/error_logs/insertErrorLog";

/**
 * @deprecated Use `handleError` or `handleChatError` from '@/lib/errors/handleError' instead.
 * This function is kept for backward compatibility but will be removed in a future version.
 * 
 * The new unified error handlers follow DRY principles and provide better error context.
 */
export interface ErrorContext {
  email?: string;
  roomId?: string;
  accountId?: string;
  messages?: Message[];
  path?: string;
  error: SerializedError;
  toolName?: string;
}

/**
 * @deprecated Use `handleError` or `handleChatError` from '@/lib/errors/handleError' instead.
 * 
 * Legacy error notification function. New code should use the unified error handlers which:
 * - Follow DRY principles
 * - Auto-generate paths from stack traces  
 * - Provide better error context
 * - Are more maintainable
 * 
 * @example
 * // Old way (deprecated):
 * sendErrorNotification({ error: serializeError(e), ...context });
 * 
 * // New way (recommended):
 * handleError(e, context);
 * // or for chat-specific errors:
 * handleChatError(e, context, 'streaming');
 */
export async function sendErrorNotification(
  params: ErrorContext
): Promise<void> {
  try {
    // Format the error message for Telegram
    const message = formatErrorMessage(params);
    
    // Send to Telegram and capture message info
    let telegramMessageId: number | undefined;
    try {
      const telegramMessage = await sendMessage(message, { parse_mode: "Markdown" });
      telegramMessageId = telegramMessage.message_id;
    } catch (err) {
      console.error("Failed to send error notification to Telegram:", err);
    }

    // Insert into Supabase error_logs table (using legacy approach)
    const errorLogContext = {
      email: params.email,
      roomId: params.roomId,
      accountId: params.accountId,
      messages: params.messages,
      path: params.path,
      error: params.error,
      toolName: params.toolName,
    };

    const errorLogResult = await insertErrorLog(errorLogContext, telegramMessageId);
    
    if (errorLogResult) {
      console.log(`Error logged to database with ID: ${errorLogResult.id}`);
    } else {
      console.error("Failed to insert error log to database");
    }

  } catch (err) {
    console.error("Error in sendErrorNotification:", err);
  }
}
