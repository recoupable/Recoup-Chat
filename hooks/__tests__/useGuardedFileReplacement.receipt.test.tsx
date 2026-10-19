// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import { initial, file, saved, opened } from "./guardedReplacement.fixture";
import { act, renderHook } from "@testing-library/react";
import { useGuardedFileReplacement } from "../useGuardedFileReplacement";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";

it("clears a confirmed save after account change without reopening another account", async () => {
  let complete!: (value: { uploaded: { path: string; sha: string }[] }) => void;
  vi.mocked(uploadSandboxFiles).mockReturnValue(
    new Promise((done) => {
      complete = done;
    }),
  );
  const { result, rerender } = renderHook(
    (props) => useGuardedFileReplacement(props),
    { initialProps: initial },
  );
  let saving!: Promise<void>;
  await act(async () => {
    saving = result.current.replace([file]);
  });
  rerender({ ...initial, scopeKey: "actor-b" });
  await act(async () => {
    complete({ uploaded: [{ path: opened.path, sha: "b".repeat(40) }] });
    await saving;
  });
  expect(result.current.hasPending).toBe(false);
  expect(saved).not.toHaveBeenCalled();
  rerender(initial);
  expect(result.current.pending).toBeNull();
  expect(result.current.error).toBeNull();
});
