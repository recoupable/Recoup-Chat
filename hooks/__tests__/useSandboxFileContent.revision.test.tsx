// @vitest-environment jsdom
import React from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import useSandboxFileContent from "../useSandboxFileContent";
import { getFileContents } from "@/lib/sandboxes/getFileContents";

let actor = "actor-a";
const token = vi.fn(async () => "synthetic-token");
vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({ user: { id: actor }, getAccessToken: token }),
}));
vi.mock("@/lib/api/getClientApiBaseUrl", () => ({
  getClientApiBaseUrl: () => "https://api-synthetic-recoup.vercel.app",
}));
vi.mock("@/lib/sandboxes/getFileContents", () => ({
  getFileContents: vi.fn(),
}));
let client: QueryClient;
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
beforeEach(() => {
  vi.clearAllMocks();
  actor = "actor-a";
  token.mockResolvedValue("synthetic-token");
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
});
afterEach(() => {
  cleanup();
  client.clear();
  focusManager.setFocused(undefined);
});

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

it("does not bind a late authentication result to a different account's revision", async () => {
  let release!: (value: string) => void;
  token.mockReturnValueOnce(
    new Promise<string>((resolve) => {
      release = resolve;
    }),
  );
  vi.mocked(getFileContents).mockResolvedValue({
    content: "Actor B",
    imageUrl: null,
    sha: "b".repeat(40),
  });
  const { result, rerender } = renderHook(
    () => useSandboxFileContent({ path: "draft.txt", includeRevision: true }),
    { wrapper },
  );
  await waitFor(() => expect(token).toHaveBeenCalledTimes(1));
  actor = "actor-b";
  rerender();
  await waitFor(() =>
    expect(result.current.openedRevision?.scopeKey).toBe("actor-b"),
  );
  await act(async () => {
    release("synthetic-token");
  });
  expect(getFileContents).toHaveBeenCalledTimes(1);
  expect(result.current.content).toBe("Actor B");
  expect(
    client.getQueryData([
      "sandbox-file-content",
      "https://api-synthetic-recoup.vercel.app",
      "actor-a",
      "draft.txt",
      true,
    ]),
  ).toBeUndefined();
});
