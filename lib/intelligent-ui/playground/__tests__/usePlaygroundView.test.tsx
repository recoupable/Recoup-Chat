// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePlaygroundView } from "../usePlaygroundView";
import { playgroundScenarios, type PlaygroundScenario } from "../scenarios";
import {
  emptyViewState,
  VIEW_STATE_MAX_SERIALIZED_LENGTH,
  type PlaygroundViewState,
} from "../viewState";

const release = playgroundScenarios[0];
const sourcing = playgroundScenarios[1];
const stored = new Map<string, string>();
const getItem = vi.fn((key: string) => stored.get(key) ?? null);
const setItem = vi.fn((key: string, value: string) => {
  stored.set(key, value);
});
const savedView: PlaygroundViewState = {
  selectedRowIds: ["daybreak"],
  filter: "day",
  notes: "Keep this practice note",
  evidenceId: "contributor-note",
};

function keyFor(scenario: PlaygroundScenario) {
  const { workspaceId, subject } = scenario.initial.context;
  return `recoup:iui:fixture-v1:${workspaceId}:${subject.kind}:${subject.id}`;
}

beforeEach(() => {
  stored.clear();
  getItem.mockReset().mockImplementation((key) => stored.get(key) ?? null);
  setItem.mockReset().mockImplementation((key, value) => {
    stored.set(key, value);
  });
  vi.stubGlobal("localStorage", { getItem, setItem });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("usePlaygroundView", () => {
  it("restores saved work before the first persistence write, including not-yet-streamed rows", () => {
    stored.set(keyFor(release), JSON.stringify(savedView));
    const { result } = renderHook(() => usePlaygroundView(release));
    expect(result.current.restored).toBe(true);
    expect(result.current.view).toEqual(savedView);
    expect(setItem).toHaveBeenCalledExactlyOnceWith(
      keyFor(release),
      JSON.stringify(savedView),
    );
    expect(result.current.saved).toBe(true);
  });

  it("immediately persists each edit so a quick scenario switch cannot lose it", () => {
    const { result } = renderHook(() => usePlaygroundView(release));
    setItem.mockClear();
    act(() => {
      result.current.setView({ ...emptyViewState, notes: "First edit" });
    });
    expect(JSON.parse(stored.get(keyFor(release))!).notes).toBe("First edit");
    act(() => {
      result.current.setView({ ...savedView, notes: "Final edit" });
    });
    expect(JSON.parse(stored.get(keyFor(release))!)).toEqual({
      ...savedView,
      notes: "Final edit",
    });
    expect(setItem).toHaveBeenCalledTimes(2);
    expect(result.current.saved).toBe(true);
  });

  it("restores the latest edit after an immediate unmount and remount", () => {
    stored.set(keyFor(release), JSON.stringify(savedView));
    const { result, unmount } = renderHook(() => usePlaygroundView(release));
    act(() => {
      result.current.setView({
        ...savedView,
        notes: "Last edit before switching",
      });
    });
    unmount();
    const reopened = renderHook(() => usePlaygroundView(release));
    expect(reopened.result.current.view).toEqual({
      ...savedView,
      notes: "Last edit before switching",
    });
  });

  it("remounts different scenarios with isolated storage and restores each scenario's own notes", () => {
    const sourceView = {
      ...emptyViewState,
      notes: "Supplier note",
      selectedRowIds: ["fieldwork"],
      evidenceId: "sample-log",
    };
    stored.set(keyFor(release), JSON.stringify(savedView));
    stored.set(keyFor(sourcing), JSON.stringify(sourceView));
    const first = renderHook(() => usePlaygroundView(release));
    expect(first.result.current.view).toEqual(savedView);
    first.unmount();
    const second = renderHook(() => usePlaygroundView(sourcing));
    expect(second.result.current.view).toEqual(sourceView);
    act(() => {
      second.result.current.setView({
        ...sourceView,
        notes: "Updated supplier note",
      });
    });
    second.unmount();
    const reopened = renderHook(() => usePlaygroundView(release));
    expect(reopened.result.current.view).toEqual(savedView);
    expect(JSON.parse(stored.get(keyFor(sourcing))!).notes).toBe(
      "Updated supplier note",
    );
    expect(JSON.parse(stored.get(keyFor(release))!)).toEqual(savedView);
  });

  it.each(["workspace", "kind", "subject"] as const)(
    "separates storage when only the %s identity changes",
    (field) => {
      const other = structuredClone(release);
      if (field === "workspace")
        other.initial.context.workspaceId = "different-workspace";
      if (field === "kind")
        other.initial.context.subject.kind = "different-kind";
      if (field === "subject")
        other.initial.context.subject.id = "different-subject";
      stored.set(keyFor(release), JSON.stringify(savedView));
      const { result } = renderHook(() => usePlaygroundView(other));
      expect(result.current.view).toEqual(emptyViewState);
      expect(setItem).toHaveBeenCalledWith(
        keyFor(other),
        JSON.stringify(emptyViewState),
      );
      expect(stored.get(keyFor(release))).toBe(JSON.stringify(savedView));
    },
  );

  it("filters unknown selected row and evidence IDs without discarding valid notes", () => {
    stored.set(
      keyFor(release),
      JSON.stringify({
        ...savedView,
        selectedRowIds: ["daybreak", "foreign-row"],
        evidenceId: "foreign-evidence",
      }),
    );
    const { result } = renderHook(() => usePlaygroundView(release));
    expect(result.current.view).toEqual({
      ...savedView,
      selectedRowIds: ["daybreak"],
      evidenceId: null,
    });
  });

  it.each([
    "{broken}",
    JSON.stringify({ ...emptyViewState, notes: 42 }),
    JSON.stringify({ ...emptyViewState, notes: "x".repeat(4001) }),
    JSON.stringify({ ...emptyViewState, untrustedField: "value" }),
    "x".repeat(VIEW_STATE_MAX_SERIALIZED_LENGTH + 1),
  ])("recovers from invalid or oversized saved data: case %#", (raw) => {
    stored.set(keyFor(release), raw);
    const { result } = renderHook(() => usePlaygroundView(release));
    expect(result.current.restored).toBe(true);
    expect(result.current.view).toEqual(emptyViewState);
    expect(setItem).toHaveBeenCalledExactlyOnceWith(
      keyFor(release),
      JSON.stringify(emptyViewState),
    );
  });

  it("keeps working in memory when storage access is denied", () => {
    getItem.mockImplementation(() => {
      throw new DOMException("Disabled", "SecurityError");
    });
    setItem.mockImplementation(() => {
      throw new DOMException("Disabled", "SecurityError");
    });
    const { result } = renderHook(() => usePlaygroundView(release));
    expect(result.current.restored).toBe(true);
    act(() => {
      result.current.setView(savedView);
    });
    expect(result.current.view).toEqual(savedView);
    expect(result.current.saved).toBe(false);
    expect(stored.has(keyFor(release))).toBe(false);
  });

  it("does not claim saved after quota failure and can save a subsequent edit", () => {
    const { result } = renderHook(() => usePlaygroundView(release));
    setItem.mockImplementationOnce(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    act(() => {
      result.current.setView(savedView);
    });
    expect(result.current.saved).toBe(false);
    act(() => {
      result.current.setView({ ...savedView, notes: "A later edit" });
    });
    expect(result.current.saved).toBe(true);
    expect(JSON.parse(stored.get(keyFor(release))!).notes).toBe("A later edit");
  });
});
