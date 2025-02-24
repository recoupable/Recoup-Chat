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
    console.debug("[Agent] Validating environment...");
    validateEnvironment();

    console.debug("[Agent] Initializing LLM with model:", AI_MODEL);
    const llm = new ChatOpenAI({
      modelName: AI_MODEL,
    });

    const agentConfig: AgentConfig = {
      threadId: options.threadId || "recoup-artist-agent",
    };
    console.debug("[Agent] Created config:", agentConfig);

    console.debug(
      "[Agent] Creating React agent with tools:",
      options.tools?.length || 0
    );

    const agent = createReactAgent({
      llm,
      tools: options.tools || [],
      messageModifier: DESCRIPTION,
    });
    console.debug("[Agent] Agent created successfully");

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
