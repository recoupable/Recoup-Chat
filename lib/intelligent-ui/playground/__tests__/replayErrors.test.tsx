// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useExampleReplay } from "../useExampleReplay";
import { playgroundScenarios } from "../scenarios";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it.each(["The encoded data was not valid", "Failed to fetch"])(
  "does not expose native transport messages: %s",
  async (message) => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError(message)));
    const { result } = renderHook(() =>
      useExampleReplay(playgroundScenarios[0]),
    );
    await act(async () => {
      await result.current.replay();
    });
    expect(result.current.status).toBe("error");
    expect(result.current.error).toContain("could not be loaded or validated");
    expect(result.current.error).not.toContain(message);
  },
);
