// @vitest-environment jsdom
import { expect, it } from "vitest";
import { token, file, initial } from "./guardedReplacement.fixture";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useGuardedFileReplacement } from "../useGuardedFileReplacement";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";

it("blocks a scope/path change while acquiring authentication", async () => {
  let resolve!: (value: string) => void;
  token.mockReturnValue(
    new Promise<string>((done) => {
      resolve = done;
    }),
  );
  const { result, rerender } = renderHook(
    (props) => useGuardedFileReplacement(props),
    { initialProps: initial },
  );
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.replace([file]);
  });
  rerender({ ...initial, scopeKey: "actor-b", selectedPath: "other.txt" });
  await act(async () => {
    resolve("synthetic-token");
    await pending;
  });
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
  expect(result.current.pending).toBeNull(); // Withhold another account's local draft.
  rerender(initial);
  expect(result.current.pending?.file).toBe(file); // Retained, not discarded.
});

it("does not begin an upload after the view unmounts during authentication", async () => {
  let resolve!: (value: string) => void;
  token.mockReturnValue(
    new Promise<string>((done) => {
      resolve = done;
    }),
  );
  const { result, unmount } = renderHook(() =>
    useGuardedFileReplacement(initial),
  );
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.replace([file]);
  });
  unmount();
  await act(async () => {
    resolve("synthetic-token");
    await pending;
  });
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
});
