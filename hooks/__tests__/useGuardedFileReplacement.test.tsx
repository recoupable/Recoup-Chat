// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { useGuardedFileReplacement } from "../useGuardedFileReplacement";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { SandboxFileConflictError } from "@/lib/sandboxes/SandboxFileConflictError";

const token = vi.fn(async () => "synthetic-token");
vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({ getAccessToken: token }),
}));
vi.mock("@/lib/sandboxes/uploadSandboxFiles", () => ({
  uploadSandboxFiles: vi.fn(),
}));
vi.mock("@/lib/sandboxes/getGuardedGitApiBaseUrl", () => ({
  getGuardedGitApiBaseUrl: () => "https://api-synthetic-recoup.vercel.app",
}));
const opened = {
  path: "notes/draft.txt",
  sha: "a".repeat(40),
  scopeKey: "actor-a",
  apiBaseUrl: "https://api-synthetic-recoup.vercel.app",
};
const file = new File(["Unsaved replacement"], "draft.txt");
const saved = vi.fn();
const initial = {
  enabled: true,
  opened,
  selectedPath: opened.path,
  scopeKey: opened.scopeKey,
  onSaved: saved,
};
beforeEach(() => {
  vi.clearAllMocks();
  token.mockResolvedValue("synthetic-token");
});

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

it("rejects a different file or missing opened revision without legacy fallback", async () => {
  const { result } = renderHook(() =>
    useGuardedFileReplacement({ ...initial, opened: undefined }),
  );
  await act(async () => {
    await result.current.replace([file]);
  });
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
  expect(result.current.error).toBeTruthy();
});

it("suppresses duplicate drops while a save is in flight", async () => {
  let resolve!: (value: { uploaded: { path: string; sha: string }[] }) => void;
  vi.mocked(uploadSandboxFiles).mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const { result } = renderHook(() => useGuardedFileReplacement(initial));
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.replace([file]);
  });
  await waitFor(() => expect(uploadSandboxFiles).toHaveBeenCalledTimes(1));
  await act(async () => {
    await result.current.replace([file]);
  });
  await act(async () => {
    resolve({ uploaded: [{ path: "draft.txt", sha: "b".repeat(40) }] });
    await pending;
  });
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
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
