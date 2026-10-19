import type { Surface } from "../../schema";

export const scope = {
  messageId: "assistant-1",
  surfaceId: "synthetic-summary",
  workspaceId: "synthetic-workspace",
  subject: { kind: "queue", id: "synthetic-queue" },
};

export function snapshotPart(revision: number, text: string) {
  const data: Surface = {
    schemaVersion: 1,
    id: scope.surfaceId,
    revision,
    title: "Synthetic summary",
    description: "Contract fixture, no connected services",
    context: {
      workspaceId: scope.workspaceId,
      subject: { ...scope.subject, label: "Synthetic queue" },
    },
    components: [],
    evidence: [],
    fallbackText: text,
    answer: {
      revision,
      parts: [{ type: "markdown", id: "explanation", text }],
    },
  };
  return { type: "data-intelligent-ui-snapshot" as const, id: data.id, data };
}
