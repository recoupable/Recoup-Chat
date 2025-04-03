import { Message, ToolSet } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ANTHROPIC_MODEL } from "@/lib/consts";

interface StreamConfigParams {
  system: string;
  messages: Message[];
  tools: ToolSet;
}

export function createStreamConfig({
  system,
  messages,
  tools,
}: StreamConfigParams) {
  return {
    model: anthropic(ANTHROPIC_MODEL),
    system,
    messages,
    providerOptions: {
      anthropic: {
        thinking: { type: "enabled", budgetTokens: 12000 },
      },
    },
    tools,
    maxSteps: 11,
    toolCallStreaming: true,
  };
}
