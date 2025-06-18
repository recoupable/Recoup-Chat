import { sendMessage } from "@/lib/telegram/sendMessage";
import { formatErrorMessage } from "./formatErrorMessage";
import { logErrorToSupabase } from "@/lib/supabase/errorLogs/insertErrorLogs";
import { ErrorContext } from "@/types/ErrorContext";

/**
 * Sends error notification to Telegram and logs to Supabase
 * Non-blocking to avoid impacting API operations
 */
export async function sendErrorNotification(
  params: ErrorContext
): Promise<void> {
  try {
    const message = formatErrorMessage(params);
    
    // Send to Telegram
    await sendMessage(message, { parse_mode: "Markdown" }).catch((err) => {
      console.error("Failed to send error notification:", err);
    });
    
    // Log to Supabase (non-blocking)
    logErrorToSupabase(params);
    
  } catch (err) {
    console.error("Error in sendErrorNotification:", err);
  }
}
