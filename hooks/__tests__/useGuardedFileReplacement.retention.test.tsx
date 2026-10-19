// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import { opened, file, initial } from "./guardedReplacement.fixture";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useGuardedFileReplacement } from "../useGuardedFileReplacement";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { SandboxFileConflictError } from "@/lib/sandboxes/SandboxFileConflictError";

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

it("never replaces a retained file with a subsequent drop in this or another account", async () => {
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
  const nextFile = new File(["Different replacement"], "other.txt");
  const nextOpened = { ...opened, path: "other.txt", sha: "b".repeat(40) };
  rerender({ ...initial, opened: nextOpened, selectedPath: "other.txt" });
  await act(async () => {
    await result.current.replace([nextFile]);
  });
  expect(result.current.pending?.file).toBe(file);
  rerender({
    ...initial,
    opened: { ...nextOpened, scopeKey: "actor-b" },
    scopeKey: "actor-b",
    selectedPath: "other.txt",
  });
  await act(async () => {
    await result.current.replace([nextFile]);
  });
  expect(result.current.pending).toBeNull();
  rerender(initial);
  expect(result.current.pending?.file).toBe(file);
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
});
