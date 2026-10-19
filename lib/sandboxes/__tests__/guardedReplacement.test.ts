import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGuardedGitApiBaseUrl } from "../getGuardedGitApiBaseUrl";
import { getFileContents } from "../getFileContents";
import { uploadSandboxFiles } from "../uploadSandboxFiles";
import { SandboxFileConflictError } from "../SandboxFileConflictError";
import { upload } from "@vercel/blob/client";

vi.mock("@vercel/blob/client", () => ({ upload: vi.fn() }));
let selectedApi = "https://api-synthetic-recoup.vercel.app";
vi.mock("@/lib/api/getClientApiBaseUrl", () => ({
  getClientApiBaseUrl: () => selectedApi,
}));
const fetchMock = vi.fn();
const sha = "a".repeat(40);
const file = new File(["Unsaved replacement"], "draft.txt");
const opened = {
  path: "notes/draft.txt",
  sha,
  apiBaseUrl: selectedApi,
  scopeKey: "actor-a",
};
const guard = { opened, isCurrent: () => true };

beforeEach(() => {
  vi.clearAllMocks();
  selectedApi = opened.apiBaseUrl;
  vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", selectedApi);
  vi.stubGlobal("fetch", fetchMock);
  vi.mocked(upload).mockResolvedValue({
    url: "https://blob.example/draft",
  } as never);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("explicit immutable API gate", () => {
  it("is disabled by default and for mutable/changed targets", () => {
    vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", "");
    expect(getGuardedGitApiBaseUrl()).toBeNull();
    vi.stubEnv(
      "NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN",
      "https://api.recoupable.dev",
    );
    selectedApi = "https://api.recoupable.dev";
    expect(getGuardedGitApiBaseUrl()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", opened.apiBaseUrl);
    expect(getGuardedGitApiBaseUrl()).toBeNull();
    selectedApi = opened.apiBaseUrl;
    expect(getGuardedGitApiBaseUrl()).toBe(selectedApi);
  });

  it("never requests a versioned read or stages a guarded save while disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", "");
    await expect(
      getFileContents("synthetic-token", opened.path, {
        includeRevision: true,
      }),
    ).rejects.toThrow();
    await expect(
      uploadSandboxFiles({
        accessToken: "synthetic-token",
        files: [file],
        path: "notes",
        guard,
      }),
    ).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
  });
});

it("retains a valid empty opened text file and observed revision", async () => {
  fetchMock.mockResolvedValue(
    Response.json({ status: "success", content: "", sha }),
  );
  expect(
    await getFileContents("synthetic-token", opened.path, {
      includeRevision: true,
    }),
  ).toEqual({ content: "", imageUrl: null, sha });
  expect(fetchMock).toHaveBeenCalledWith(
    `${selectedApi}/api/sandboxes/file?path=notes%2Fdraft.txt&include_revision=true`,
    expect.anything(),
  );
});

it("rejects a predecessor response with no revision instead of falling back", async () => {
  fetchMock.mockResolvedValue(
    Response.json({ status: "success", content: "Legacy response" }),
  );
  await expect(
    getFileContents("synthetic-token", opened.path, { includeRevision: true }),
  ).rejects.toThrow();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("sends the opened SHA unchanged and surfaces a conflict without retry", async () => {
  fetchMock.mockResolvedValue(
    Response.json(
      { status: "error", conflicts: ["draft.txt"] },
      { status: 409 },
    ),
  );
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
      guard,
    }),
  ).rejects.toBeInstanceOf(SandboxFileConflictError);
  expect(upload).toHaveBeenCalledWith(
    "draft.txt",
    file,
    expect.objectContaining({
      handleUploadUrl: `${selectedApi}/api/sandboxes/staged-file`,
    }),
  );
  const body = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(body.files).toEqual([
    { url: "https://blob.example/draft", name: "draft.txt", expected_sha: sha },
  ]);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("blocks a context change after staging and never commits to a new target", async () => {
  vi.mocked(upload).mockImplementation(async () => {
    selectedApi = "https://api-other-recoup.vercel.app";
    return { url: "https://blob.example/draft" } as never;
  });
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
      guard,
    }),
  ).rejects.toThrow();
  expect(fetchMock).not.toHaveBeenCalled();
});

it("keeps legacy uploads unguarded when the option is omitted", async () => {
  vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", "");
  fetchMock.mockResolvedValue(
    Response.json({
      status: "success",
      uploaded: [{ path: "notes/draft.txt", sha }],
    }),
  );
  expect(
    await uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
    }),
  ).toMatchObject({ uploaded: [{ sha }] });
  expect(
    JSON.parse(fetchMock.mock.calls[0][1].body).files[0],
  ).not.toHaveProperty("expected_sha");
});

it("returns a confirmed new revision after a guarded save", async () => {
  fetchMock.mockResolvedValue(
    Response.json({
      status: "success",
      uploaded: [{ path: "draft.txt", sha: "b".repeat(40) }],
    }),
  );
  const result = await uploadSandboxFiles({
    accessToken: "synthetic-token",
    files: [file],
    path: "notes",
    guard,
  });
  expect(result.uploaded[0].sha).toBe("b".repeat(40));
});

it("retains uncertain or partial outcomes as failures", async () => {
  fetchMock.mockResolvedValue(
    Response.json({
      status: "success",
      uploaded: [],
      errors: ["Not confirmed"],
    }),
  );
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
      guard,
    }),
  ).rejects.toThrow("confirmed");
});

it("blocks wrong paths and stale account conditions before staging", async () => {
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "other",
      guard,
    }),
  ).rejects.toThrow();
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
      guard: { opened, isCurrent: () => false },
    }),
  ).rejects.toThrow();
  expect(upload).not.toHaveBeenCalled();
  expect(fetchMock).not.toHaveBeenCalled();
});
