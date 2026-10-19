import { expect, it } from "vitest";
import type { UIMessage } from "ai";
import { acceptSurfaceSnapshotPart } from "../acceptSurfaceSnapshotPart";
import { scope, snapshotPart } from "./snapshotPart";

const original: UIMessage = {
  id: scope.messageId,
  role: "assistant",
  parts: [{ type: "text", text: "Existing explanation" }],
};

it("accepts a full snapshot into its owning message without mutating other parts", () => {
  const result = acceptSurfaceSnapshotPart(
    original,
    snapshotPart(1, "First version"),
    scope,
  );
  expect(result.status).toBe("accepted");
  expect(result.message.parts).toEqual([
    { type: "text", text: "Existing explanation" },
    snapshotPart(1, "First version"),
  ]);
  expect(original.parts).toEqual([
    { type: "text", text: "Existing explanation" },
  ]);
});

it("does not roll a serialized accepted revision backwards during replay", () => {
  const accepted = acceptSurfaceSnapshotPart(
    original,
    snapshotPart(4, "Recovered version"),
    scope,
  ).message;
  const reloaded: UIMessage = JSON.parse(JSON.stringify(accepted));
  const result = acceptSurfaceSnapshotPart(
    reloaded,
    snapshotPart(1, "Old version"),
    scope,
  );
  expect(result.status).toBe("stale");
  expect(result.message).toBe(reloaded);
  expect(result.message.parts[1]).toEqual(snapshotPart(4, "Recovered version"));
});

it("treats an identical replay as a no-op but rejects conflicting content at the same revision", () => {
  const accepted = acceptSurfaceSnapshotPart(
    original,
    snapshotPart(2, "Accepted version"),
    scope,
  ).message;
  const duplicate = acceptSurfaceSnapshotPart(
    accepted,
    snapshotPart(2, "Accepted version"),
    scope,
  );
  expect(duplicate.status).toBe("replayed");
  expect(duplicate.message).toBe(accepted);
  const conflict = acceptSurfaceSnapshotPart(
    accepted,
    snapshotPart(2, "Different claim"),
    scope,
  );
  expect(conflict.status).toBe("conflict");
  expect(conflict.message).toBe(accepted);
});

it("recognizes persisted record values even when storage reorders object keys", () => {
  const part = snapshotPart(2, "Accepted version");
  part.data.components = [
    {
      type: "collection",
      id: "items",
      title: "Items",
      columns: [
        { key: "name", label: "Name" },
        { key: "state", label: "State" },
      ],
      rows: [
        {
          id: "row-1",
          label: "One",
          values: { name: "One", state: "Ready" },
          evidenceIds: [],
        },
      ],
      complete: true,
      totalCount: 1,
    },
  ];
  const accepted = acceptSurfaceSnapshotPart(original, part, scope).message;
  const replay = structuredClone(part);
  const collection = replay.data.components[0];
  if (collection.type !== "collection") throw new Error("Expected collection");
  collection.rows[0].values = { state: "Ready", name: "One" };
  const result = acceptSurfaceSnapshotPart(accepted, replay, scope);
  expect(result.status).toBe("replayed");
  expect(result.message).toBe(accepted);
});

it("rejects an oversized full snapshot without replacing the accepted message", () => {
  const part = snapshotPart(2, "Large version");
  part.data.components = [
    {
      type: "collection",
      id: "items",
      title: "Items",
      columns: [{ key: "note", label: "Note" }],
      complete: true,
      totalCount: 150,
      rows: Array.from({ length: 150 }, (_, i) => ({
        id: `row-${i}`,
        label: "Row",
        values: { note: "x".repeat(2000) },
        evidenceIds: [],
      })),
    },
  ];
  const result = acceptSurfaceSnapshotPart(original, part, scope);
  expect(result.status).toBe("rejected");
  expect(result.message).toBe(original);
});

const invalidInputs: Array<
  [string, (part: ReturnType<typeof snapshotPart>) => unknown]
> = [
  [
    "unsupported schema",
    (part) => ({ ...part, data: { ...part.data, schemaVersion: 2 } }),
  ],
  [
    "patch instead of full snapshot",
    () => ({ type: "surface.patch", revision: 2 }),
  ],
  ["transient snapshot", (part) => ({ ...part, transient: true })],
  ["executable field", (part) => ({ ...part, callback: "run()" })],
  [
    "wrong workspace",
    (part) => ({
      ...part,
      data: {
        ...part.data,
        context: { ...part.data.context, workspaceId: "other" },
      },
    }),
  ],
  [
    "wrong subject",
    (part) => ({
      ...part,
      data: {
        ...part.data,
        context: {
          ...part.data.context,
          subject: { ...part.data.context.subject, id: "other" },
        },
      },
    }),
  ],
  [
    "wrong subject kind",
    (part) => ({
      ...part,
      data: {
        ...part.data,
        context: {
          ...part.data.context,
          subject: { ...part.data.context.subject, kind: "other" },
        },
      },
    }),
  ],
  ["wrong part id", (part) => ({ ...part, id: "other" })],
  [
    "wrong surface id",
    (part) => ({ ...part, data: { ...part.data, id: "other" } }),
  ],
  [
    "stale written answer",
    (part) => ({
      ...part,
      data: { ...part.data, answer: { ...part.data.answer, revision: 1 } },
    }),
  ],
];
it.each(invalidInputs)(
  "isolates %s without changing accepted state",
  (_name, change) => {
    const accepted = acceptSurfaceSnapshotPart(
      original,
      snapshotPart(1, "Accepted version"),
      scope,
    ).message;
    const result = acceptSurfaceSnapshotPart(
      accepted,
      change(snapshotPart(2, "Rejected version")),
      scope,
    );
    expect(result.status).toBe("rejected");
    expect(result.message).toBe(accepted);
  },
);

it("allows a self-contained later snapshot to recover a revision gap", () => {
  const first = acceptSurfaceSnapshotPart(
    original,
    snapshotPart(1, "First version"),
    scope,
  ).message;
  const result = acceptSurfaceSnapshotPart(
    first,
    snapshotPart(5, "Recovered version"),
    scope,
  );
  expect(result.status).toBe("accepted");
  expect(result.message.parts[1]).toEqual(snapshotPart(5, "Recovered version"));
});

it.each([
  { ...original, id: "another-message" },
  { ...original, role: "user" as const },
])("refuses to attach state to a different message or role", (message) => {
  const result = acceptSurfaceSnapshotPart(
    message,
    snapshotPart(1, "Wrong owner"),
    scope,
  );
  expect(result.status).toBe("rejected");
  expect(result.message).toBe(message);
});

it("does not let a foreign saved part establish the revision floor", () => {
  const foreign = snapshotPart(99, "Other workspace");
  foreign.data.context.workspaceId = "other";
  const message: UIMessage = { ...original, parts: [foreign] };
  const result = acceptSurfaceSnapshotPart(
    message,
    snapshotPart(1, "Correct workspace"),
    scope,
  );
  expect(result.status).toBe("accepted");
  expect(result.message.parts).toEqual([snapshotPart(1, "Correct workspace")]);
});

it("keeps the accepted snapshot detached from later input mutation", () => {
  const input = snapshotPart(1, "Accepted version");
  const accepted = acceptSurfaceSnapshotPart(original, input, scope).message;
  input.data.fallbackText = "Mutated after acceptance";
  expect(accepted.parts[1]).toEqual(snapshotPart(1, "Accepted version"));
});

it("collapses duplicate stored parts when accepting the next full snapshot", () => {
  const message: UIMessage = {
    ...original,
    parts: [
      ...original.parts,
      snapshotPart(1, "First version"),
      snapshotPart(1, "First version"),
    ],
  };
  const result = acceptSurfaceSnapshotPart(
    message,
    snapshotPart(2, "Next version"),
    scope,
  );
  expect(result.message.parts).toEqual([
    ...original.parts,
    snapshotPart(2, "Next version"),
  ]);
});

it("rejects non-JSON cyclic input without throwing through the caller", () => {
  const input: Record<string, unknown> = {};
  input.data = input;
  const result = acceptSurfaceSnapshotPart(original, input, scope);
  expect(result.status).toBe("rejected");
  expect(result.message).toBe(original);
});
