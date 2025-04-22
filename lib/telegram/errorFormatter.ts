/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Error formatting utilities for Telegram notifications
 * Handles proper serialization of error objects with circular reference protection
 */

/**
 * Safely stringifies an object with circular reference protection
 * @param obj Any object to stringify
 * @param maxDepth Maximum recursion depth
 * @returns Safe string representation of the object
 */
export function safeStringify(obj: unknown, maxDepth = 3): string {
  // Handle basic types
  if (obj === null) return "null";
  if (obj === undefined) return "undefined";
  if (typeof obj !== "object") return String(obj);

  // Track objects to prevent circular references
  const seenObjects = new WeakSet();

  function stringify(value: unknown, depth: number): string {
    // Handle primitives
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value !== "object") return String(value);

    // Prevent circular references and depth explosion
    if (seenObjects.has(value as object) || depth > maxDepth) {
      return "[Object]";
    }

    try {
      // Track this object
      seenObjects.add(value as object);

      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        const items = value
          .slice(0, 5) // Limit array items
          .map((item) => stringify(item, depth + 1))
          .join(", ");
        return value.length > 5
          ? `[${items}, ... ${value.length - 5} more items]`
          : `[${items}]`;
      }

      // Handle errors specially
      if (value instanceof Error) {
        return formatError(value);
      }

      // Handle objects
      const entries = Object.entries(value)
        .slice(0, 10) // Limit object properties
        .map(([key, val]) => `${key}: ${stringify(val, depth + 1)}`)
        .join(", ");

      return Object.keys(value).length > 10
        ? `{${entries}, ... ${Object.keys(value).length - 10} more properties}`
        : `{${entries}}`;
    } catch (error) {
      return `[Error during stringify: ${(error as Error).message}]`;
    }
  }

  return stringify(obj, 0);
}

/**
 * Formats an Error object into a readable string
 * @param error The error to format
 * @returns Formatted error string
 */
export function formatError(error: Error): string {
  const parts = [];

  // Basic error info
  parts.push(`Error Type: ${error.name || "Error"}`);
  parts.push(`Message: ${error.message || "No message"}`);

  // Get non-standard properties
  const standardProps = ["name", "message", "stack"];
  const extraProps = Object.getOwnPropertyNames(error).filter(
    (prop) => !standardProps.includes(prop)
  );

  // Format additional properties
  if (extraProps.length > 0) {
    parts.push("Additional Properties:");
    for (const prop of extraProps) {
      try {
        const value = (error as any)[prop];
        parts.push(`  ${prop}: ${safeStringify(value, 1)}`);
      } catch (e) {
        console.error("Error accessing property:", e);
        parts.push(`  ${prop}: [Error accessing property]`);
      }
    }
  }

  // Stack trace (limited)
  if (error.stack) {
    // Extract only first few lines of stack
    const stackLines = error.stack.split("\n").slice(0, 5);
    parts.push("Stack Trace:");
    parts.push(stackLines.join("\n"));
  }

  return parts.join("\n");
}

/**
 * Formats any type of error or object for Telegram notifications
 * @param error The error object to format
 * @returns Formatted string
 */
export function formatErrorForTelegram(error: unknown): string {
  try {
    // Handle Error objects
    if (error instanceof Error) {
      return formatError(error);
    }

    // Handle error-like objects
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as any).message === "string"
    ) {
      return formatError(new Error((error as any).message));
    }

    // Handle other objects
    return `Non-Error Object: ${safeStringify(error)}`;
  } catch (e) {
    // Ultimate fallback
    return `Error during formatting: ${e instanceof Error ? e.message : "Unknown error"}`;
  }
}
