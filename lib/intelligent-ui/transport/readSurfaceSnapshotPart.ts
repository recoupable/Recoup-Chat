import { SURFACE_STREAM_LIMITS } from "../streamLimits";
import {
  surfaceSnapshotPartSchema,
  type SurfaceSnapshotPart,
} from "./surfaceSnapshotPartSchema";
import type { SurfaceSnapshotScope } from "./types";

/** Validate a bounded full snapshot against identity supplied by the caller. */
export function readSurfaceSnapshotPart(
  input: unknown,
  scope: SurfaceSnapshotScope,
): SurfaceSnapshotPart | null {
  try {
    if (
      new TextEncoder().encode(JSON.stringify(input)).byteLength >
      SURFACE_STREAM_LIMITS.lineBytes
    )
      return null;
    const parsed = surfaceSnapshotPartSchema.safeParse(input);
    if (!parsed.success) return null;
    const part = parsed.data;
    const { context } = part.data;
    return part.id === scope.surfaceId &&
      part.data.id === part.id &&
      context.workspaceId === scope.workspaceId &&
      context.subject.kind === scope.subject.kind &&
      context.subject.id === scope.subject.id
      ? part
      : null;
  } catch {
    return null;
  }
}
