import { afterEach, beforeEach, vi } from "vitest";
import { getGuardedGitApiBaseUrl } from "../getGuardedGitApiBaseUrl";
import { getFileContents } from "../getFileContents";
import { uploadSandboxFiles } from "../uploadSandboxFiles";
import { SandboxFileConflictError } from "../SandboxFileConflictError";
import { upload } from "@vercel/blob/client";

vi.mock("@vercel/blob/client", () => ({ upload: vi.fn() }));
const apiState = vi.hoisted(() => ({
  value: "https://api-synthetic-recoup.vercel.app",
}));
vi.mock("@/lib/api/getClientApiBaseUrl", () => ({
  getClientApiBaseUrl: () => apiState.value,
}));
const fetchMock = vi.fn();
const sha = "a".repeat(40);
const file = new File(["Unsaved replacement"], "draft.txt");
const opened = {
  path: "notes/draft.txt",
  sha,
  apiBaseUrl: apiState.value,
  scopeKey: "actor-a",
};
const guard = { opened, isCurrent: () => true };

beforeEach(() => {
  vi.clearAllMocks();
  apiState.value = opened.apiBaseUrl;
  vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", apiState.value);
  vi.stubGlobal("fetch", fetchMock);
  vi.mocked(upload).mockResolvedValue({
    url: "https://blob.example/draft",
  } as never);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
export {
  getGuardedGitApiBaseUrl,
  getFileContents,
  uploadSandboxFiles,
  SandboxFileConflictError,
  upload,
  apiState,
  fetchMock,
  sha,
  file,
  opened,
  guard,
};
