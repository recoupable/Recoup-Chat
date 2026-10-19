import { expect, it } from "vitest";
import type { UIMessage } from "ai";
import { acceptSurfaceSnapshotPart } from "../acceptSurfaceSnapshotPart";
import { retainAcceptedSurfaceSnapshot } from "../retainAcceptedSurfaceSnapshot";
import { scope, snapshotPart } from "./snapshotPart";

it("retains the accepted snapshot when a later cumulative write omits it, then reloads and replays safely", () => {
  const first: UIMessage = {
    id: scope.messageId,
    role: "assistant",
    parts: [],
  };
  const accepted = acceptSurfaceSnapshotPart(
    first,
    snapshotPart(2, "Accepted version"),
    scope,
  ).message;
  const later: UIMessage = {
    id: scope.messageId,
    role: "assistant",
    metadata: { source: "synthetic" },
    parts: [
      { type: "text", text: "The continued explanation" },
      { type: "data-commit", id: "other-result", data: { status: "pending" } },
    ],
  };
  const persisted = JSON.stringify(
    retainAcceptedSurfaceSnapshot(later, accepted, scope),
  );
  const reloaded: UIMessage = JSON.parse(persisted);
  const replay = acceptSurfaceSnapshotPart(
    reloaded,
    snapshotPart(1, "Old version"),
    scope,
  );
  expect(replay.status).toBe("stale");
  expect(replay.message.parts).toEqual([
    ...later.parts,
    snapshotPart(2, "Accepted version"),
  ]);
  expect(replay.message.metadata).toEqual({ source: "synthetic" });
  expect(later.parts).toHaveLength(2);
  const recovered = acceptSurfaceSnapshotPart(
    reloaded,
    snapshotPart(5, "Recovered full snapshot"),
    scope,
  );
  expect(recovered.message.parts).toEqual([
    ...later.parts,
    snapshotPart(5, "Recovered full snapshot"),
  ]);
});

it("does not promote raw SDK parts to accepted state during persistence recovery", () => {
  const accepted: UIMessage = {
    id: scope.messageId,
    role: "assistant",
    parts: [snapshotPart(2, "Accepted version")],
  };
  const raw: UIMessage = {
    id: scope.messageId,
    role: "assistant",
    parts: [
      { type: "text", text: "New ordinary text" },
      snapshotPart(99, "Not accepted yet"),
      snapshotPart(1, "Duplicate raw part"),
    ],
  };
  const result = retainAcceptedSurfaceSnapshot(raw, accepted, scope);
  expect(result.parts).toEqual([
    { type: "text", text: "New ordinary text" },
    snapshotPart(2, "Accepted version"),
  ]);
  expect(raw.parts).toHaveLength(3);
});

it("does not recover another message's or workspace's saved state", () => {
  const ordinary: UIMessage = {
    id: scope.messageId,
    role: "assistant",
    parts: [{ type: "text", text: "Keep this" }],
  };
  const foreign = snapshotPart(2, "Other workspace");
  foreign.data.context.workspaceId = "other";
  expect(
    retainAcceptedSurfaceSnapshot(
      ordinary,
      { ...ordinary, parts: [foreign] },
      scope,
    ),
  ).toBe(ordinary);
  expect(
    retainAcceptedSurfaceSnapshot(
      ordinary,
      {
        id: "other-message",
        role: "assistant",
        parts: [snapshotPart(2, "Other message")],
      },
      scope,
    ),
  ).toBe(ordinary);
});
