import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import validateEnvironment from "./validateEnvironment";
import type { AgentConfig, AgentOptions, AgentResponse } from "./types";
import { AI_MODEL, DESCRIPTION } from "../consts";

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

    const llm = new ChatOpenAI({
      modelName: AI_MODEL,
    });

    const agentConfig: AgentConfig = {
      threadId: options.threadId || "recoup-artist-agent",
    };

    const agent = createReactAgent({
      llm,
      tools: options.tools || [],
      messageModifier: DESCRIPTION,
    });

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("[Agent] Failed to initialize agent:", {
      error,
      options,
      model: AI_MODEL,
      threadId: options.threadId,
    });
    throw error;
  }
}

export default initializeAgent;
