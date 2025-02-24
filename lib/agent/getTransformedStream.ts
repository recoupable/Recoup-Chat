import { AgentMessage } from "./types";

type AgentChunk = {
  agent?: {
    messages: AgentMessage[];
  };
  tools?: {
    messages: AgentMessage[];
  };
};

/**
 * Transforms an agent message stream into a string content stream
 * @param stream The input stream from the agent
 * @returns A transformed stream containing only the message content
 */
const getTransformedStream = (
  stream: ReadableStream<AgentChunk>
): ReadableStream<string> => {
  const transformStream = new TransformStream<AgentChunk, string>({
    async transform(chunk, controller) {
      let content: string | undefined;

      if ("agent" in chunk && chunk.agent?.messages?.[0]?.content) {
        content = chunk.agent.messages[0].content;
      } else if ("tools" in chunk && chunk.tools?.messages?.[0]?.content) {
        content = chunk.tools.messages[0].content;
      }

      if (content) {
        controller.enqueue(content);
      }
    },
  });

  return stream.pipeThrough(transformStream);
};

export default getTransformedStream;
