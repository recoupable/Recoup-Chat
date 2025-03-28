import { streamText } from "ai";
import { isRateLimitError, isMCPError, getErrorMessage } from "./errors";
import {
  primaryModel,
  fallbackModel,
  getStreamTextOpts,
  StreamTextOptions,
} from "./models";

/**
 * Attempts to stream a response with failover support
 */
export async function streamWithFailover(opts: StreamTextOptions) {
  try {
    console.log("[Model] Using Anthropic");
    const result = await streamText({
      ...getStreamTextOpts(opts),
      model: primaryModel,
    });
    // Return the raw stream response
    return result;
  } catch (error) {
    console.error("[Failover] Primary model error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: getErrorMessage(error),
      type: error instanceof Error ? error.constructor.name : "Unknown",
    });

    // Return a streaming error for MCP errors
    if (isMCPError(error)) {
      console.log("SWEETS MCP ERROR");
    }

    // Try fallback model for rate limit errors
    if (isRateLimitError(error)) {
      try {
        console.log("[Model] Failing over to DeepSeek");
        const result = await streamText({
          ...getStreamTextOpts(opts),
          model: fallbackModel,
        });
        // Return the raw stream response
        return result;
      } catch (fallbackError) {
        console.error("[Failover] Fallback model error:", {
          name: fallbackError instanceof Error ? fallbackError.name : "Unknown",
          message: getErrorMessage(fallbackError),
          type:
            fallbackError instanceof Error
              ? fallbackError.constructor.name
              : "Unknown",
        });
        console.log("SWEETS FALLBACK ERROR");
      }
    }
  }
}
