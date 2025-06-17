import { Message } from "ai";

// Minimal non-whitespace placeholder - uses zero-width space plus period
const INVISIBLE_PLACEHOLDER = ".";

/**
 * Replaces empty message content with minimal placeholder to prevent API errors.
 * Anthropic API requires all text content blocks to contain non-whitespace text.
 * Uses a single period which is minimal but satisfies API requirements.
 */
export const sanitizeEmptyMessages = (messages: Array<Message>): Array<Message> => {
  return messages.map((message) => {
    // If content is empty or only whitespace, replace with placeholder
    if (!message.content || message.content.trim().length === 0) {
      return {
        ...message,
        content: INVISIBLE_PLACEHOLDER,
      };
    }
    
    return message;
  });
}; 