import { YouTubeErrorBuilder } from "./error-builder";
import { YouTubeRevenueResult } from "@/types/youtube";

function isApiError(error: unknown): error is { code: number } {
  return error !== null && typeof error === 'object' && 'code' in error;
}

function isForbiddenError(error: unknown): boolean {
  return isApiError(error) && error.code === 403;
}

function isUnauthorizedClientError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("unauthorized_client");
}

export function handleRevenueError(error: unknown): YouTubeRevenueResult {
  if (isForbiddenError(error)) {
    return YouTubeErrorBuilder.createToolError(
      "Access denied. Channel may not be monetized or lacks Analytics permissions."
    );
  }

  if (isUnauthorizedClientError(error)) {
    return YouTubeErrorBuilder.createToolError(
      "Unauthorized client. Please re-authenticate your YouTube account."
    );
  }

  const message = error instanceof Error 
    ? error.message 
    : "Failed to get YouTube revenue data. Please check your authentication and try again, or channel might not be monetized or have insufficient permissions.";

  return YouTubeErrorBuilder.createToolError(message);
} 