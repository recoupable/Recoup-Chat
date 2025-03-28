import { Message, ToolSet } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";

export interface StreamTextOptions {
  messages: Message[];
  system?: string;
  tools?: ToolSet;
  maxSteps?: number;
  toolCallStreaming?: boolean;
}

/**
 * Primary model configuration using Anthropic
 */
export const primaryModel = anthropic("claude-3-sonnet-20240229");

/**
 * Fallback model configuration using DeepSeek
 */
export const fallbackModel = deepseek("deepseek-reasoner");

/**
 * Common stream options
 */
export const streamOptions = {
  sendReasoning: true,
  providerOptions: {
    anthropic: {
      thinking: { type: "enabled" as const, budgetTokens: 12000 },
    },
  },
  maxSteps: 11,
  toolCallStreaming: true,
} as const;

/**
 * Creates stream text options with model configuration
 */
export function getStreamTextOpts(opts: StreamTextOptions) {
  return {
    ...streamOptions,
    ...opts,
  };
}
