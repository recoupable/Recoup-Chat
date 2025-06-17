import { Message } from "ai";
import { SerializedError } from "@/lib/errors/serializeError";
import supabase from "@/lib/supabase/serverClient";

export interface ErrorContext {
  email?: string;
  roomId?: string;
  messages?: Message[];
  path: string;
  error: SerializedError;
  accountId?: string; // Added for account_id mapping
}

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
    return false
  }
}

function extractToolName(context: ErrorContext): string | null {
  const errorMessage = context.error.message || '';
  const errorType = context.error.name || '';
  
  // Check for specific error types first
  if (errorType === 'AI_RetryError' || errorMessage.includes('rate limit')) {
    return 'rate_limit';
  }
  
  if (errorMessage.includes('tool execution') || errorMessage.includes('Error executing tool')) {
    const toolMatch = errorMessage.match(/Error executing tool\s+([a-zA-Z_]+)/i);
    if (toolMatch) return toolMatch[1];
  }
  
  // Check for specific tool errors
  if (errorMessage.includes('search_web') || errorMessage.includes('Perplexity')) {
    return 'search_web';
  }
  
  if (errorMessage.includes('searchTwitter') || errorMessage.includes('Twitter')) {
    return 'search_twitter';
  }
  
  if (errorMessage.includes('contactTeam')) {
    return 'contact_team';
  }
  
  // Fall back to path-based extraction
  return context.path?.split('/').pop() || null;
}
