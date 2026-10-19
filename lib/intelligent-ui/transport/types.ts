import type { UIMessage } from "ai";

/** Trusted caller context, not authority supplied by a generated data part. */
export interface SurfaceSnapshotScope {
  messageId: string;
  surfaceId: string;
  workspaceId: string;
  subject: { kind: string; id: string };
}

export interface SurfaceSnapshotResult {
  message: UIMessage;
  status: "accepted" | "replayed" | "stale" | "conflict" | "rejected";
}
