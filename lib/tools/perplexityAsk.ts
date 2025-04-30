import { tool } from "ai";
import performChatCompletion from "../perplexity/performChatCompletion";
import { z } from "zod";

/**
 * Fetches and filters Perplexity tools, excluding the problematic perplexity_reason tool
 * @returns An object containing only the perplexity_ask tool
 */
const perplexityAsk = tool({
  description:
    "Engages in a conversation using the Sonar API. " +
    "Accepts an array of messages (each with a role and content) " +
    "and returns a ask completion response from the Perplexity model.",
  parameters: z.object({
    messages: z.array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    ),
  }),
  execute: async ({ messages }) => {
    if (!Array.isArray(messages)) {
      throw new Error(
        "Invalid arguments for perplexity_ask: 'messages' must be an array"
      );
    }
    // Invoke the chat completion function with the provided messages
    const result = await performChatCompletion(messages, "sonar-pro");
    return {
      content: [{ type: "text", text: result }],
      isError: false,
    };
  },
});

export default perplexityAsk;
