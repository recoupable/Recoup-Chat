import { AgentMessage, ToolUseContent } from "./types";

type AgentChunk = {
  agent?: {
    messages: AgentMessage[];
  };
  tools?: {
    messages: AgentMessage[];
  };
};

/**
 * Extracts text content from a message's content array
 */
const extractTextContent = (content: AgentMessage["content"]): string => {
  try {
    // If content is a string (tool response), try to parse it
    if (typeof content === "string") {
      try {
        // For tool responses, just return the raw string for now
        // We can add specific formatting for tool responses if needed
        return content;
      } catch (e) {
        console.error("[Stream Transform] Error parsing tool response:", e);
        return content; // Return raw string if parsing fails
      }
    }

    // Handle array content (agent messages)
    const textContent = content
      .filter(
        (item): item is { type: "text"; text: string } => item.type === "text"
      )
      .map((item) => item.text)
      .join(" ");

    return textContent;
  } catch (error) {
    console.error("[Stream Transform] Error extracting text:", {
      error,
      contentType: typeof content,
      content: JSON.stringify(content).slice(0, 200) + "...",
    });
    return "";
  }
};

/**
 * Formats tool use content into a readable string
 */
const formatToolUse = (content: AgentMessage["content"]): string => {
  try {
    // Skip tool use formatting for string content
    if (typeof content === "string") {
      return "";
    }

    const toolUseItems = content.filter(
      (item): item is ToolUseContent => item.type === "tool_use"
    );

    if (toolUseItems.length === 0) return "";

    return toolUseItems.map((item) => `[Using tool: ${item.name}]`).join(" ");
  } catch (error) {
    console.error("[Stream Transform] Error formatting tool use:", {
      error,
      contentType: typeof content,
      content: JSON.stringify(content).slice(0, 200) + "...",
    });
    return "";
  }
};

/**
 * Transforms an agent message stream into a string content stream
 * @param stream The input stream from the agent
 * @returns A transformed stream containing only the message content
 */
const getTransformedStream = (
  stream: ReadableStream<AgentChunk>
): ReadableStream<string> => {
  let chunkCount = 0;

  const transformStream = new TransformStream<AgentChunk, string>({
    async transform(chunk, controller) {
      chunkCount++;

      let content = "";

      try {
        if ("agent" in chunk && chunk.agent?.messages?.[0]?.content) {
          const message = chunk.agent.messages[0];
          const textContent = extractTextContent(message.content);
          const toolContent = formatToolUse(message.content);

          content = [textContent, toolContent].filter(Boolean).join(" ");
        } else if ("tools" in chunk && chunk.tools?.messages?.[0]?.content) {
          const message = chunk.tools.messages[0];
          content = extractTextContent(message.content);
        }

        if (content) {
          controller.enqueue(content);
        } else {
          console.warn(
            "[Stream Transform] No content to enqueue for chunk #" + chunkCount
          );
        }
      } catch (error) {
        console.error(
          "[Stream Transform] Error processing chunk #" + chunkCount + ":",
          {
            error,
            chunk: JSON.stringify(chunk, null, 2),
          }
        );
        // Don't throw - allow stream to continue
      }
    },
  });

  return stream.pipeThrough(transformStream);
};

export default getTransformedStream;
