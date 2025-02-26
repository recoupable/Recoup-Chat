import { ChatAnthropic } from "@langchain/anthropic";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import validateEnvironment from "./validateEnvironment";
import type { AgentOptions, AgentResponse } from "./types";
import { DESCRIPTION } from "../consts";
import { getSegmentFansTool } from "../tools/getSegmentFans";

const AI_MODEL = "claude-3-7-sonnet-20250219";
/**
 * Initialize the agent with LangGraph
 * @param options Configuration options for the agent
 * @returns Agent executor and config
 */
async function initializeAgent(
  options: AgentOptions = {}
): Promise<AgentResponse> {
  try {
    validateEnvironment();

    const llm = new ChatAnthropic({
      modelName: AI_MODEL,
    });

    const memory = new MemorySaver();

    const defaultTools = options.segmentId ? [getSegmentFansTool] : [];
    const tools = options.tools
      ? [...defaultTools, ...options.tools]
      : defaultTools;

    const agent = createReactAgent({
      llm,
      tools,
      messageModifier: DESCRIPTION,
      checkpointSaver: memory,
    });

    return { agent };
  } catch (error) {
    console.error("[Agent] Failed to initialize agent:", {
      error,
      options,
      model: AI_MODEL,
      threadId: options.threadId,
      errorDetails:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
    });
    throw error;
  }
}

export default initializeAgent;
