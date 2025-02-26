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

interface TextContent {
  type: "text";
  text: string;
}

export interface ToolUseContent {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

type ContentItem = TextContent | ToolUseContent;

/**
 * Represents a message from an agent or tool
 */
export type AgentMessage = {
  content: ContentItem[];
  [key: string]: unknown;
};
