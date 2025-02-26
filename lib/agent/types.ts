import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { Tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export interface AgentResponse {
  agent: ReturnType<typeof createReactAgent>;
}

export interface AgentContext {
  llm: ChatOpenAI;
  memory: MemorySaver;
  tools: Tool[];
}

export interface AgentOptions {
  threadId?: string;
  tools?: Tool[];
  segmentId?: string;
}

/**
 * Represents a message from an agent or tool
 */
export type AgentMessage = {
  content: string;
  [key: string]: unknown;
};
