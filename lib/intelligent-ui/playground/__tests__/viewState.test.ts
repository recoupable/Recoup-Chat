import { describe, expect, it } from "vitest";
import {
  VIEW_STATE_MAX_SERIALIZED_LENGTH,
  viewStateSchema,
} from "../viewState";

describe("saved view bounds", () => {
  it("accepts surface IDs up to 128 characters", () => {
    expect(
      viewStateSchema.safeParse({
        selectedRowIds: ["r".repeat(128)],
        evidenceId: "e".repeat(128),
        filter: "",
        notes: "",
      }).success,
    ).toBe(true);
  });

  it("can read the largest schema-valid JSON even when every character needs escaping", () => {
    const view = {
      selectedRowIds: Array(100).fill("\u0000".repeat(128)),
      evidenceId: "\u0000".repeat(128),
      filter: "\u0000".repeat(200),
      notes: "\u0000".repeat(4000),
    };
    expect(viewStateSchema.safeParse(view).success).toBe(true);
    const serialized = JSON.stringify(view);
    expect(serialized.length).toBeGreaterThan(12000);
    expect(serialized.length).toBeLessThanOrEqual(
      VIEW_STATE_MAX_SERIALIZED_LENGTH,
    );
    expect(viewStateSchema.parse(JSON.parse(serialized))).toEqual(view);
  });
});
