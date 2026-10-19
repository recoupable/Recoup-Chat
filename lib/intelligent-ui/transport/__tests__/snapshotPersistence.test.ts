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

it.each([
  [1, 4],
  [4, 1],
])(
  "recovers the highest accepted copy from saved revisions %i, %i",
  (first, second) => {
    const ordinary: UIMessage = {
      id: scope.messageId,
      role: "assistant",
      parts: [{ type: "text", text: "Continued explanation" }],
    };
    const accepted: UIMessage = {
      ...ordinary,
      parts: [
        snapshotPart(first, `Revision ${first}`),
        snapshotPart(second, `Revision ${second}`),
      ],
    };
    const recovered = retainAcceptedSurfaceSnapshot(ordinary, accepted, scope);
    expect(recovered.parts).toEqual([
      ...ordinary.parts,
      snapshotPart(4, "Revision 4"),
    ]);
    const reloaded: UIMessage = JSON.parse(JSON.stringify(recovered));
    const replay = acceptSurfaceSnapshotPart(
      reloaded,
      snapshotPart(2, "Intermediate"),
      scope,
    );
    expect(replay.status).toBe("stale");
    expect(replay.message).toBe(reloaded);
  },
);

it("keeps the first stored copy on a highest-revision tie and rejects conflicting replay", () => {
  const first = snapshotPart(4, "First accepted claim");
  const conflict = snapshotPart(4, "Conflicting saved claim");
  const ordinary: UIMessage = {
    id: scope.messageId,
    role: "assistant",
    parts: [],
  };
  const recovered = retainAcceptedSurfaceSnapshot(
    ordinary,
    {
      ...ordinary,
      parts: [snapshotPart(1, "Old version"), first, conflict],
    },
    scope,
  );
  expect(recovered.parts).toEqual([first]);
  const replay = acceptSurfaceSnapshotPart(recovered, conflict, scope);
  expect(replay.status).toBe("conflict");
  expect(replay.message).toBe(recovered);
});
