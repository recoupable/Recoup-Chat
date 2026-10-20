import { describe, expect, it } from "vitest";
import { selectPresentation } from "../selectPresentation";
import { surfaceWithCollection } from "./surfaceWithCollection";
import { getCompletedExample } from "../../playground/getCompletedExample";
import { playgroundScenarios } from "../../playground/scenarios";
import type { PresentationIntent } from "../types";

const host = { distribution: true, timeline: true };
const listening = getCompletedExample(
  playgroundScenarios.find((item) => item.id === "listening")!,
);

describe("presentation by declared task benefit", () => {
  it("keeps differing supplier records as text when that is sufficient", () => {
    expect(
      selectPresentation(surfaceWithCollection(), { kind: "text" }, host),
    ).toEqual({ mode: "text", reason: "text-sufficient" });
    const supplier = getCompletedExample(
      playgroundScenarios.find((item) => item.id === "supplier")!,
    );
    expect(
      supplier.answer?.parts.some((part) => part.type === "representation"),
    ).toBe(false);
    expect(
      supplier.answer?.parts.some(
        (part) => part.type === "markdown" && part.text.includes("| Supplier"),
      ),
    ).toBe(true);
  });

  it("admits a static distribution without manufacturing controls or actions", () => {
    const result = selectPresentation(
      listening,
      {
        kind: "representation",
        componentId: "listening-share",
        benefit: "show-distribution",
      },
      host,
    );
    expect(result.mode).toBe("visual");
    expect(result.reason).toBe("show-distribution");
  });

  it("uses text when all supplied values are measured zeros", () => {
    const surface = structuredClone(listening);
    const component = surface.components[0];
    if (component.type !== "distribution")
      throw new Error("Expected distribution");
    component.items.forEach((item) => (item.value = 0));
    expect(
      selectPresentation(
        surface,
        {
          kind: "representation",
          componentId: component.id,
          benefit: "show-distribution",
        },
        host,
      ),
    ).toEqual({ mode: "text", reason: "zero-total" });
  });

  it("retains the visual for a positive total without a minimum-value threshold", () => {
    const surface = structuredClone(listening);
    const component = surface.components[0];
    if (component.type !== "distribution")
      throw new Error("Expected distribution");
    component.items.forEach((item) => (item.value = 0));
    component.items[0].value = 0.001;
    expect(
      selectPresentation(
        surface,
        {
          kind: "representation",
          componentId: component.id,
          benefit: "show-distribution",
        },
        host,
      ).mode,
    ).toBe("visual");
  });

  it("falls back when the requested representation or host support is absent", () => {
    expect(
      selectPresentation(
        listening,
        {
          kind: "representation",
          componentId: "missing",
          benefit: "show-distribution",
        },
        host,
      ).reason,
    ).toBe("representation-unavailable");
    expect(
      selectPresentation(
        listening,
        {
          kind: "representation",
          componentId: "listening-share",
          benefit: "show-distribution",
        },
        { ...host, distribution: false },
      ).reason,
    ).toBe("unsupported-host");
  });

  it("rejects a benefit unrelated to its representation and unsupported intent", () => {
    expect(
      selectPresentation(
        listening,
        {
          kind: "representation",
          componentId: "listening-share",
          benefit: "navigate-time",
        },
        host,
      ).reason,
    ).toBe("benefit-mismatch");
    expect(
      selectPresentation(
        listening,
        { kind: "dashboard" } as unknown as PresentationIntent,
        host,
      ).reason,
    ).toBe("unsupported-intent");
  });
});
