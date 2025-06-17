import supabase from "@/lib/supabase/serverClient";
import { ErrorContext } from "@/types/ErrorContext";
import { extractToolName } from "@/lib/utils/extractToolName";

/**
 * logErrorToSupabase(context: ErrorContext): Promise<boolean>
 * Logs errors to Supabase error_logs table.
 */
export async function logErrorToSupabase(context: ErrorContext): Promise<boolean> {
  try {
    const lastMessage = context.messages?.findLast(m => m.role === 'user')?.content || null
    const toolName = extractToolName(context)

    const { error } = await supabase
      .from('error_logs')
      .insert({
        raw_message: context.error.message,
        telegram_message_id: Date.now(),
        account_id: context.accountId || null,
        room_id: context.roomId || null,
        error_timestamp: new Date().toISOString(),
        error_message: context.error.message,
        error_type: context.error.name || 'Error',
        tool_name: toolName,
        last_message: typeof lastMessage === 'string' ? lastMessage : JSON.stringify(lastMessage),
        stack_trace: context.error.stack || null
      })

    return !error

  } catch {
    // Silently fail - don't break the error flow
    return false
  }
} 