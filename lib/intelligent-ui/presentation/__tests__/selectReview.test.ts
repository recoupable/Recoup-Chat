import { describe, expect, it } from "vitest";
import { componentSchema } from "../../schema";
import { selectPresentation } from "../selectPresentation";
import { surfaceWithCollection } from "./surfaceWithCollection";

describe("review presentation", () => {
  it("shows exactly the requested follow-ups in stable source order without mutating the source", () => {
    const surface = surfaceWithCollection({ complete: false, totalCount: 5 });
    const before = structuredClone(surface);
    const result = selectPresentation(surface, {
      kind: "review",
      componentId: "options",
      rowIds: ["three", "one"],
    });
    expect(result.mode).toBe("inline");
    if (result.mode !== "inline") throw new Error("Expected inline review");
    expect(result.component.rows.map((row) => row.id)).toEqual([
      "one",
      "three",
    ]);
    expect(result.component.complete).toBe(true);
    expect(result.component.totalCount).toBe(2);
    expect(result.sourceComplete).toBe(false);
    expect(componentSchema.safeParse(result.component).success).toBe(true);
    expect(surface).toEqual(before);
  });

  it.each([
    { rowIds: [] },
    { rowIds: ["unknown"] },
    { rowIds: ["one", "unknown"] },
    { rowIds: ["one", "one"] },
  ])(
    "fails closed for empty, unknown, or duplicate review IDs: $rowIds",
    ({ rowIds }) => {
      expect(
        selectPresentation(surfaceWithCollection(), {
          kind: "review",
          componentId: "options",
          rowIds,
        }),
      ).toEqual({ mode: "text", reason: "review-rows-unavailable" });
    },
  );

  it("does not substitute available rows for requested follow-ups that have not arrived", () => {
    const surface = surfaceWithCollection();
    const component = surface.components[0];
    if (component.type !== "collection") throw new Error("Expected collection");
    component.rows = component.rows.slice(0, 1);
    component.complete = false;
    expect(
      selectPresentation(surface, {
        kind: "review",
        componentId: "options",
        rowIds: ["two", "three"],
      }).mode,
    ).toBe("text");
  });
});
