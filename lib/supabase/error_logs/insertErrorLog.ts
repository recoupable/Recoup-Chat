import supabase from "@/lib/supabase/serverClient";
import type { TablesInsert } from "@/types/database.types";
import { SerializedError } from "@/lib/errors/serializeError";
import { Message } from "ai";

export interface ErrorLogData {
  account_id?: string | null;
  room_id?: string | null;
  error_message?: string | null;
  error_timestamp?: string | null;
  error_type?: string | null;
  last_message?: string | null;
  raw_message: string;
  stack_trace?: string | null;
  telegram_message_id?: number | null;
  tool_name?: string | null;
}

export interface ErrorLogContext {
  email?: string;
  roomId?: string;
  accountId?: string;
  messages?: Message[];
  path?: string;
  error: SerializedError;
  toolName?: string;
}

/**
 * Inserts an error log into the Supabase error_logs table
 * @param context - Error context information
 * @param telegramMessageId - Optional Telegram message ID for linking
 * @returns The inserted error log record or null if failed
 */
export async function insertErrorLog(
  context: ErrorLogContext,
  telegramMessageId?: number
): Promise<{ id: string } | null> {
  try {
    const timestamp = new Date().toISOString();
    const lastMessage = context.messages && context.messages.length > 0 
      ? context.messages[context.messages.length - 1]?.content 
      : null;

    // Create the raw message that includes all context for debugging
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