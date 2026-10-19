import { createUIMessageStreamResponse, type UIMessageChunk } from "ai";

export function workflowResponse(chunks: UIMessageChunk[]) {
  return createUIMessageStreamResponse({
    stream: new ReadableStream<UIMessageChunk>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk);
        controller.close();
      },
    }),
    headers: { "x-workflow-run-id": "synthetic-run" },
  });
}
