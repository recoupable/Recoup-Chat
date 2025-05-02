/**
 * Extracts serializable properties from error objects
 * Ensures errors can be properly JSON serialized
 */
export function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { message: String(error) };
}
