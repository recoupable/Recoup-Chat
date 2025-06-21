import { Message } from "ai";
import { serializeError, SerializedError } from "./serializeError";
import { sendMessage } from "@/lib/telegram/sendMessage";
import { formatErrorMessage } from "@/lib/telegram/errors/formatErrorMessage";
import { insertErrorLog } from "@/lib/supabase/error_logs/insertErrorLog";

// Unified interface for all error contexts
export interface ErrorContext {
  email?: string;
  roomId?: string;
  accountId?: string;
  messages?: Message[];
  toolName?: string;
  // Auto-generated fields
  path?: string;
  error?: SerializedError;
}

// Simplified error handler that does everything
export async function handleError(
  error: unknown,
  context: ErrorContext = {},
  source?: string
): Promise<void> {
  try {
    // Auto-generate path from source or call stack
    const path = source || getCallerPath();
    
    // Serialize error once
    const serializedError = serializeError(error);
    
    // Build unified context
    const fullContext: Required<Pick<ErrorContext, 'error' | 'path'>> & ErrorContext = {
      ...context,
      error: serializedError,
      path,
    };

    // Send to Telegram and capture message ID (parallel to avoid blocking)
    const telegramPromise = sendToTelegram(fullContext);
    
    // Log to database with Telegram message ID
    const telegramMessage = await telegramPromise;
    await insertErrorLog(fullContext, telegramMessage?.message_id);
    
    console.log(`Error logged: ${serializedError.message} at ${path}`);
    
  } catch (handlingError) {
    // Never let error handling break the app
    console.error("Error in error handler:", handlingError);
  }
}

// Helper: Send to Telegram (extracted for reusability)
async function sendToTelegram(context: ErrorContext & { error: SerializedError }) {
  try {
    const message = formatErrorMessage(context);
    return await sendMessage(message, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
    return null;
  }
}

// Helper: Auto-detect caller path from stack trace
function getCallerPath(): string {
  const stack = new Error().stack;
  if (!stack) return "unknown";
  
  const lines = stack.split('\n');
  // Skip: Error constructor, getCallerPath, handleError
  const callerLine = lines[4] || lines[3] || lines[2];
  
  // Extract path from stack trace line
  const match = callerLine?.match(/at\s+(.+)\s+\(/);
  return match?.[1] || "unknown";
}

// Convenience wrapper for chat API errors
export function handleChatError(
  error: unknown,
  context: Omit<ErrorContext, 'path'>,
  stage: 'streaming' | 'completion' | 'global' = 'global'
) {
  return handleError(error, context, `/api/chat - ${stage}`);
}