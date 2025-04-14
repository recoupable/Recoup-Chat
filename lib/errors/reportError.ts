import { Message } from "ai";

interface ErrorMetadata {
  [key: string]: unknown;
}

interface ErrorReportOptions {
  error:
    | Error
    | {
        name: string;
        message: string;
        stack?: string;
      };
  email?: string;
  roomId?: string;
  path?: string;
  messages?: Message[];
  metadata?: ErrorMetadata;
}

/**
 * Reports an error to our error tracking system
 * Non-blocking to avoid impacting the main application flow
 */
export async function reportError({
  error,
  email,
  roomId,
  path,
  messages,
}: ErrorReportOptions): Promise<void> {
  try {
    await fetch("/api/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: {
          name: error.name || "UnknownError",
          message: error.message || "An unknown error occurred",
          stack: error.stack,
        },
        email,
        roomId,
        path:
          path ||
          (typeof window !== "undefined"
            ? window.location.pathname
            : undefined),
        messages,
      }),
    });
  } catch (reportError) {
    // Log locally but don't throw to avoid impacting the main application
    console.error("Failed to report error:", reportError);
  }
}
