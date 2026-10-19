// @vitest-environment jsdom
import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import GuardedFileReplacementNotice from "../GuardedFileReplacementNotice";
import SandboxFileTree from "../SandboxFileTree";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { SandboxFileConflictError } from "@/lib/sandboxes/SandboxFileConflictError";

vi.stubGlobal("React", React);
const fixture = vi.hoisted(() => ({
  enabled: true,
  legacy: vi.fn(),
  reopen: vi.fn(),
  refetch: vi.fn(),
}));
const file = new File(["Unsaved replacement"], "draft.txt");
const opened = {
  path: "notes/draft.txt",
  sha: "a".repeat(40),
  scopeKey: "actor-a",
  apiBaseUrl: "https://api-synthetic-recoup.vercel.app",
};
vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({ getAccessToken: async () => "synthetic-token" }),
}));
vi.mock("@/lib/sandboxes/uploadSandboxFiles", () => ({
  uploadSandboxFiles: vi.fn(),
}));
vi.mock("@/lib/sandboxes/getGuardedGitApiBaseUrl", () => ({
  getGuardedGitApiBaseUrl: () =>
    fixture.enabled ? "https://api-synthetic-recoup.vercel.app" : null,
}));
vi.mock("@/hooks/useSandboxes", () => ({
  default: () => ({
    filetree: [{ name: "draft.txt", path: "notes/draft.txt", type: "file" }],
    isLoading: false,
    error: null,
    refetch: fixture.refetch,
  }),
}));
vi.mock("@/hooks/useSandboxFileDrop", () => ({
  useSandboxFileDrop: () => ({
    handleFilesDropped: fixture.legacy,
    uploading: false,
  }),
}));
vi.mock("@/hooks/useSandboxFileContent", () => ({
  default: (options: { includeRevision?: boolean }) => ({
    selectedPath: "notes/draft.txt",
    scopeKey: "actor-a",
    content: "Opened draft",
    imageUrl: null,
    loading: false,
    error: null,
    select: vi.fn(),
    reopen: fixture.reopen,
    openedRevision: options.includeRevision ? opened : undefined,
  }),
}));
vi.mock("@/components/ai-elements/file-tree", () => ({
  FileTree: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("../FileNodeComponent", () => ({ default: () => null }));
vi.mock("../SandboxFilePreview", () => ({
  default: () => <p>Opened draft</p>,
}));
vi.mock("../SandboxDropZone", () => ({
  default: ({
    onDrop,
    children,
  }: {
    onDrop: (files: File[]) => void;
    children: React.ReactNode;
  }) => (
    <div>
      <button onClick={() => onDrop([file])}>Drop replacement</button>
      {children}
    </div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  fixture.enabled = true;
});
afterEach(cleanup);

it("leaves the existing upload journey unchanged while the gate is off", () => {
  fixture.enabled = false;
  render(<SandboxFileTree />);
  expect(screen.queryByRole("checkbox")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  expect(fixture.legacy).toHaveBeenCalledWith([file]);
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
});

it("keeps the actual replacement after conflict and viewing latest never retries it", async () => {
  vi.mocked(uploadSandboxFiles).mockRejectedValue(
    new SandboxFileConflictError(),
  );
  render(<SandboxFileTree />);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain("changed"),
  );
  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(
    true,
  );
  expect(screen.getByText(/Your replacement, draft.txt, is kept/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "View latest file" }));
  expect(fixture.reopen).toHaveBeenCalledWith(opened.path);
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
  expect(fixture.legacy).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Discard replacement" }));
  expect(screen.queryByRole("alert")).toBeNull();
});

it("keeps a downloadable copy of the exact selected replacement", () => {
  const OriginalURL = URL;
  const create = vi.fn(() => "blob:synthetic-local-copy");
  const revoke = vi.fn();
  vi.stubGlobal(
    "URL",
    class extends OriginalURL {
      static createObjectURL = create;
      static revokeObjectURL = revoke;
    },
  );
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  vi.useFakeTimers();
  try {
    render(
      <GuardedFileReplacementNotice
        pending={{ file, opened }}
        error="File changed"
        disabled={false}
        onReopen={vi.fn()}
        onDiscard={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Keep a copy" }));
    expect(create).toHaveBeenCalledWith(file);
    expect(click).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(revoke).toHaveBeenCalledWith("blob:synthetic-local-copy");
  } finally {
    vi.useRealTimers();
    vi.stubGlobal("URL", OriginalURL);
    click.mockRestore();
  }
});
