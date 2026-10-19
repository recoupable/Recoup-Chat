// @vitest-environment jsdom
import { expect, it } from "vitest";
import { token, file, initial } from "./guardedReplacement.fixture";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useGuardedFileReplacement } from "../useGuardedFileReplacement";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";

it("rejects a missing opened revision without legacy fallback", async () => {
  const { result } = renderHook(() =>
    useGuardedFileReplacement({ ...initial, opened: undefined }),
  );
  await act(async () => {
    await result.current.replace([file]);
  });
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
  expect(result.current.error).toBeTruthy();
});

it("rejects a differently named file without staging or legacy fallback", async () => {
  const { result } = renderHook(() => useGuardedFileReplacement(initial));
  await act(async () => {
    await result.current.replace([new File(["Different"], "other.txt")]);
  });
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
  expect(result.current.error).toContain("same name");
});

it("reports missing sign-in separately from a changed view", async () => {
  token.mockResolvedValue(null);
  const { result } = renderHook(() => useGuardedFileReplacement(initial));
  await act(async () => {
    await result.current.replace([file]);
  });
  expect(result.current.error).toBe("Please sign in to replace this file.");
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
});
