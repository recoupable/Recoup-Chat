import type { UIMessage } from "ai";
import { readSurfaceSnapshotPart } from "./readSurfaceSnapshotPart";
import { isSameJsonValue } from "./isSameJsonValue";
import { retainAcceptedSurfaceSnapshot } from "./retainAcceptedSurfaceSnapshot";
import type { SurfaceSnapshotResult, SurfaceSnapshotScope } from "./types";

/** Fold a full candidate snapshot into a cumulative accepted assistant message. */
export function acceptSurfaceSnapshotPart(
  message: UIMessage,
  input: unknown,
  scope: SurfaceSnapshotScope,
): SurfaceSnapshotResult {
  const part = readSurfaceSnapshotPart(input, scope);
  if (!part || message.id !== scope.messageId || message.role !== "assistant")
    return { message, status: "rejected" };
  const index = message.parts.findIndex(
    (p) => p.type === part.type && "id" in p && p.id === part.id,
  );
  const previous = readSurfaceSnapshotPart(message.parts[index], scope);
  if (previous && part.data.revision < previous.data.revision)
    return { message, status: "stale" };
  if (previous && part.data.revision === previous.data.revision)
    return {
      message,
      status: isSameJsonValue(part.data, previous.data)
        ? "replayed"
        : "conflict",
    };
  return {
    message: retainAcceptedSurfaceSnapshot(
      message,
      { ...message, parts: [part] },
      scope,
    ),
    status: "accepted",
  };
}
