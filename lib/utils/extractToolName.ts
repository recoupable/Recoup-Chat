import { ErrorContext } from "@/types/ErrorContext";

/**
 * extractToolName(context: ErrorContext): string | null
 * Extracts tool name from error context for categorization.
 * Used for error logging and analysis.
 */
export function extractToolName(context: ErrorContext): string | null {
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
  
  // Fall back to hardcoded tool name for chat API
  return 'chat';
} 