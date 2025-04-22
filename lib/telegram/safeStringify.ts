/**
 * Safely converts any value to a string, handling objects properly
 * Prevents "[object Object]" in string output and handles circular references
 *
 * @param value The value to stringify
 * @returns A string representation that won't result in "[object Object]"
 */
export function safeStringify(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value !== "object" || value === null) return String(value);

  // Handle Error objects specially
  if (value instanceof Error) {
    return value.message;
  }

  // For regular objects, use JSON.stringify with fallback
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return `[Object with circular reference or non-serializable content]`;
  }
}
