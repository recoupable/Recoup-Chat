import supabase from "@/lib/supabase/serverClient";
import type { TablesInsert } from "@/types/database.types";
import type { ErrorContext } from "@/lib/errors/handleError";

/**
 * Simplified error log insertion using unified ErrorContext
 * @param context - Unified error context
 * @param telegramMessageId - Optional Telegram message ID for linking
 * @returns The inserted error log record or null if failed
 */
export async function insertErrorLog(
  context: ErrorContext & { error: NonNullable<ErrorContext['error']> },
  telegramMessageId?: number
): Promise<{ id: string } | null> {
  try {
    const timestamp = new Date().toISOString();
    const lastMessage = context.messages?.[context.messages.length - 1]?.content;

    // Create comprehensive raw message for debugging
    const rawMessage = JSON.stringify({
      error: context.error,
      path: context.path,
      email: context.email,
      roomId: context.roomId,
      accountId: context.accountId,
      timestamp,
      messagesCount: context.messages?.length || 0,
      toolName: context.toolName,
    }, null, 2);

    const errorLogData: TablesInsert<"error_logs"> = {
      account_id: context.accountId || null,
      room_id: context.roomId || null,
      error_message: context.error.message || null,
      error_timestamp: timestamp,
      error_type: context.error.name || null,
      last_message: typeof lastMessage === 'string' ? lastMessage : null,
      raw_message: rawMessage,
      stack_trace: context.error.stack || null,
      telegram_message_id: telegramMessageId || null,
      tool_name: context.toolName || null,
    };

    const { data, error } = await supabase
      .from("error_logs")
      .insert(errorLogData)
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert error log to Supabase:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error in insertErrorLog:", err);
    return null;
  }
}