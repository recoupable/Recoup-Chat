import { describe, expect, it } from "vitest";
import { selectPresentation } from "../selectPresentation";
import type { PresentationIntent } from "../types";
import { surfaceWithCollection } from "./surfaceWithCollection";

const intent = { kind: "compare", componentId: "options" } as const;

describe("comparison presentation", () => {
  it("keeps a factual answer text-only even when comparison data is available", () => {
    expect(
      selectPresentation(surfaceWithCollection(), { kind: "text" }),
    ).toEqual({
      mode: "text",
      reason: "text-requested",
    });
  });

  it("selects one useful collection and preserves its partial coverage", () => {
    const surface = surfaceWithCollection({ complete: false, totalCount: 5 });
    const result = selectPresentation(surface, intent);
    expect(result).toEqual({
      mode: "inline",
      component: surface.components[0],
      sourceComplete: false,
      reason: "comparison",
    });
  });

  it("does not turn different record names or whitespace into a useful comparison", () => {
    const surface = surfaceWithCollection({
      rows: [
        {
          id: "one",
          label: "Different name",
          values: { cost: " $20 " },
          evidenceIds: [],
        },
        {
          id: "two",
          label: "Another name",
          values: { cost: "$20" },
          evidenceIds: [],
        },
      ],
      totalCount: 2,
    });
    expect(selectPresentation(surface, intent).mode).toBe("text");
  });

  it("requires distinct records with at least two supplied nonblank values", () => {
    const row = {
      id: "one",
      label: "One",
      values: { cost: "$20" },
      evidenceIds: [],
    };
    for (const rows of [
      [],
      [row],
      [row, row],
      [row, { ...row, id: "two", values: { cost: " " } }],
    ]) {
      expect(
        selectPresentation(surfaceWithCollection({ rows }), intent).mode,
      ).toBe("text");
    }
  });

  it("ignores inherited object values when testing differences", () => {
    const surface = surfaceWithCollection({
      columns: [{ key: "constructor", label: "Constructor" }],
      rows: [
        { id: "one", label: "One", values: {}, evidenceIds: [] },
        {
          id: "two",
          label: "Two",
          values: { constructor: "Provided" },
          evidenceIds: [],
        },
      ],
      totalCount: 2,
    });
    expect(selectPresentation(surface, intent).mode).toBe("text");
  });

  it("fails closed for missing components, other component types, and unknown intents", () => {
    const surface = surfaceWithCollection();
    expect(
      selectPresentation(surface, { ...intent, componentId: "missing" }).mode,
    ).toBe("text");
    surface.components = [
      {
        type: "summary",
        id: "options",
        title: "Summary",
        text: "Answer",
        evidenceIds: [],
      },
    ];
    expect(selectPresentation(surface, intent).mode).toBe("text");
    expect(
      selectPresentation(surface, {
        kind: "dashboard",
      } as unknown as PresentationIntent).mode,
    ).toBe("text");
  });
});
