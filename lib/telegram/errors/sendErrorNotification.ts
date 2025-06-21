import { Message } from "ai";
import { sendMessage } from "@/lib/telegram/sendMessage";
import { SerializedError } from "@/lib/errors/serializeError";
import { formatErrorMessage } from "./formatErrorMessage";
import { insertErrorLog, ErrorLogContext } from "@/lib/supabase/error_logs/insertErrorLog";

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
 * Sends error notification to Telegram and logs to Supabase error_logs table
 * Non-blocking to avoid impacting API operations
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

    // Insert into Supabase error_logs table
    const errorLogContext: ErrorLogContext = {
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
