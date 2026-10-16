// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CollectionComponent } from "../../schema";
import { playgroundScenarios } from "../scenarios";
import { usePlaygroundView } from "../usePlaygroundView";
import { emptyViewState, VIEW_STATE_MAX_SERIALIZED_LENGTH } from "../viewState";

const stored = new Map<string, string>();
beforeEach(() => {
  stored.clear();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("saved view limit round trips", () => {
  it("preserves long valid IDs and escaped notes across save and reload", () => {
    const scenario = structuredClone(playgroundScenarios[0]);
    const ids = Array.from({ length: 100 }, (_, index) =>
      `row-${index}`.padEnd(128, "x"),
    );
    const evidenceId = "e".repeat(128);
    const component: CollectionComponent = {
      type: "collection",
      id: "large-example",
      title: "Example records",
      columns: [{ key: "value", label: "Value" }],
      complete: true,
      rows: ids.map((id) => ({ id, label: id, values: {}, evidenceIds: [] })),
    };
    scenario.initial.components = [component];
    scenario.initial.evidence = [
      {
        id: evidenceId,
        label: "Example source",
        sourceLabel: "Fixture",
        observedAt: "2026-10-16T12:00:00Z",
        text: "Example",
        kind: "submitted",
        status: "current",
      },
    ];
    scenario.events = [{ type: "surface.snapshot", surface: scenario.initial }];
    const view = {
      selectedRowIds: ids,
      evidenceId,
      notes: "\u0000".repeat(4000),
      filter: "\u0000".repeat(200),
    };
    const { result, unmount } = renderHook(() => usePlaygroundView(scenario));
    act(() => result.current.setView(view));
    expect(result.current.saved).toBe(true);
    const serialized = [...stored.values()][0];
    expect(serialized.length).toBeGreaterThan(12000);
    expect(serialized.length).toBeLessThanOrEqual(
      VIEW_STATE_MAX_SERIALIZED_LENGTH,
    );
    unmount();
    const reopened = renderHook(() => usePlaygroundView(scenario));
    expect(reopened.result.current.view).toEqual(view);
    expect(reopened.result.current.saved).toBe(true);
  });

  it("does not claim to save or overwrite earlier work with schema-invalid state", () => {
    const { result } = renderHook(() =>
      usePlaygroundView(playgroundScenarios[0]),
    );
    act(() =>
      result.current.setView({ ...emptyViewState, notes: "Saved work" }),
    );
    const previous = [...stored.values()][0];
    act(() =>
      result.current.setView({ ...emptyViewState, notes: "x".repeat(4001) }),
    );
    expect(result.current.saved).toBe(false);
    expect([...stored.values()][0]).toBe(previous);
    expect(result.current.view.notes.length).toBe(4001);
  });
});
