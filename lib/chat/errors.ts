/**
 * Type definitions for API errors
 */
export interface AnthropicError {
  error: {
    type: string;
    message: string;
  };
}

export interface MCPError extends Error {
  name: "MCPClientError";
  message: string;
}

/**
 * Checks if an error is an Anthropic rate limit error
 */
export function isRateLimitError(error: unknown): error is AnthropicError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as AnthropicError).error === "object" &&
    (error as AnthropicError).error.type === "rate_limit_error"
  );
}

/**
 * Checks if an error is an MCP error
 */
export function isMCPError(error: unknown): error is MCPError {
  return error instanceof Error && error.name === "MCPClientError";
}

/**
 * Extracts error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isRateLimitError(error)) {
    return error.error.message;
  }
  if (isMCPError(error)) {
    return `MCP Error: ${error.message}`;
  }
  return error instanceof Error ? error.message : "Unknown error";
}
