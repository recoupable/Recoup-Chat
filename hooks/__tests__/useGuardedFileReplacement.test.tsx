// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import { opened, file, saved, initial } from "./guardedReplacement.fixture";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useGuardedFileReplacement } from "../useGuardedFileReplacement";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { SandboxFileConflictError } from "@/lib/sandboxes/SandboxFileConflictError";

it("keeps the same local file and original SHA on conflict and never retries", async () => {
  vi.mocked(uploadSandboxFiles).mockRejectedValue(
    new SandboxFileConflictError(),
  );
  const { result, rerender } = renderHook(
    (props) => useGuardedFileReplacement(props),
    { initialProps: initial },
  );
  await act(async () => {
    await result.current.replace([file]);
  });
  rerender({ ...initial, opened: { ...opened, sha: "b".repeat(40) } });
  expect(result.current.pending?.file).toBe(file);
  expect(result.current.pending?.opened.sha).toBe(opened.sha);
  expect(result.current.error).toContain("changed");
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
  expect(saved).not.toHaveBeenCalled();
});

it("clears the replacement only after confirmed success", async () => {
  vi.mocked(uploadSandboxFiles).mockResolvedValue({
    uploaded: [{ path: "draft.txt", sha: "b".repeat(40) }],
  });
  const { result } = renderHook(() => useGuardedFileReplacement(initial));
  await act(async () => {
    await result.current.replace([file]);
  });
  expect(result.current.pending).toBeNull();
  expect(saved).toHaveBeenCalledTimes(1);
});
