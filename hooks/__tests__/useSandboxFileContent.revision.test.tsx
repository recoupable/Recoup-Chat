// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import { focusManager } from "@tanstack/react-query";
import { wrapper } from "./sandboxRevision.fixture";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { getFileContents } from "@/lib/sandboxes/getFileContents";
import useSandboxFileContent from "../useSandboxFileContent";

it("retains the opened revision across focus and changes it only on explicit reopen", async () => {
  vi.mocked(getFileContents)
    .mockResolvedValueOnce({
      content: "Original",
      imageUrl: null,
      sha: "a".repeat(40),
    })
    .mockResolvedValueOnce({
      content: "Newer",
      imageUrl: null,
      sha: "b".repeat(40),
    });
  const { result } = renderHook(
    () => useSandboxFileContent({ path: "draft.txt", includeRevision: true }),
    { wrapper },
  );
  await waitFor(() =>
    expect(result.current.openedRevision?.sha).toBe("a".repeat(40)),
  );
  act(() => {
    focusManager.setFocused(false);
    focusManager.setFocused(true);
  });
  expect(getFileContents).toHaveBeenCalledTimes(1);
  act(() => result.current.reopen("draft.txt"));
  await waitFor(() =>
    expect(result.current.openedRevision?.sha).toBe("b".repeat(40)),
  );
  expect(result.current.content).toBe("Newer");
});

it("performs a fresh read when the same file is explicitly reselected", async () => {
  vi.mocked(getFileContents)
    .mockResolvedValueOnce({
      content: "Original",
      imageUrl: null,
      sha: "a".repeat(40),
    })
    .mockResolvedValueOnce({
      content: "Newer",
      imageUrl: null,
      sha: "b".repeat(40),
    });
  const { result } = renderHook(
    () => useSandboxFileContent({ includeRevision: true }),
    { wrapper },
  );
  act(() => result.current.select("draft.txt"));
  await waitFor(() =>
    expect(result.current.openedRevision?.sha).toBe("a".repeat(40)),
  );
  act(() => result.current.select("draft.txt"));
  await waitFor(() =>
    expect(result.current.openedRevision?.sha).toBe("b".repeat(40)),
  );
  expect(getFileContents).toHaveBeenCalledTimes(2);
});
