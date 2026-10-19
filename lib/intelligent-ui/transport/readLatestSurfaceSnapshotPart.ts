import type { UIMessage } from "ai";
import { readSurfaceSnapshotPart } from "./readSurfaceSnapshotPart";
import type { SurfaceSnapshotPart } from "./surfaceSnapshotPartSchema";
import type { SurfaceSnapshotScope } from "./types";

/** Restored copies may be out of order; keep the first copy on revision ties. */
export function readLatestSurfaceSnapshotPart(
  parts: UIMessage["parts"],
  scope: SurfaceSnapshotScope,
): SurfaceSnapshotPart | null {
  let latest: SurfaceSnapshotPart | null = null;
  for (const input of parts) {
    if (
      input.type !== "data-intelligent-ui-snapshot" ||
      !("id" in input) ||
      input.id !== scope.surfaceId
    )
      continue;
    const part = readSurfaceSnapshotPart(input, scope);
    if (part && (!latest || part.data.revision > latest.data.revision))
      latest = part;
  }
  return latest;
}
