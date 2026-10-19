import type { UIMessage } from "ai";
import { readSurfaceSnapshotPart } from "./readSurfaceSnapshotPart";
import type { SurfaceSnapshotScope } from "./types";

/** Preserve accepted state when a later model step rewrites ordinary message parts. */
export function retainAcceptedSurfaceSnapshot(
  message: UIMessage,
  accepted: UIMessage,
  scope: SurfaceSnapshotScope,
): UIMessage {
  if (
    accepted.id !== scope.messageId ||
    accepted.role !== "assistant" ||
    message.id !== scope.messageId ||
    message.role !== "assistant"
  )
    return message;
  const candidate = accepted.parts.find(
    (p) =>
      p.type === "data-intelligent-ui-snapshot" &&
      "id" in p &&
      p.id === scope.surfaceId,
  );
  const part = readSurfaceSnapshotPart(candidate, scope);
  if (!part) return message;
  let inserted = false;
  const parts = message.parts.flatMap((p) => {
    if (p.type !== part.type || !("id" in p) || p.id !== part.id) return [p];
    if (inserted) return [];
    inserted = true;
    return [part];
  });
  if (!inserted) parts.push(part);
  return { ...message, parts };
}
