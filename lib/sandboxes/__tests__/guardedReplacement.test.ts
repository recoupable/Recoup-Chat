import { vi, expect, it, describe } from "vitest";
import {
  apiState,
  fetchMock,
  file,
  opened,
  guard,
} from "./guardedReplacement.fixture";
import { getGuardedGitApiBaseUrl } from "../getGuardedGitApiBaseUrl";
import { getFileContents } from "../getFileContents";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { upload } from "@vercel/blob/client";

describe("explicit immutable API gate", () => {
  it("is disabled by default and for mutable/changed targets", () => {
    vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", "");
    expect(getGuardedGitApiBaseUrl()).toBeNull();
    vi.stubEnv(
      "NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN",
      "https://api.recoupable.dev",
    );
    apiState.value = "https://api.recoupable.dev";
    expect(getGuardedGitApiBaseUrl()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", opened.apiBaseUrl);
    expect(getGuardedGitApiBaseUrl()).toBeNull();
    apiState.value = opened.apiBaseUrl;
    expect(getGuardedGitApiBaseUrl()).toBe(apiState.value);
  });

  it("never requests a versioned read or stages a guarded save while disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", "");
    await expect(
      getFileContents("synthetic-token", opened.path, {
        includeRevision: true,
      }),
    ).rejects.toThrow("Protected replacement is not enabled");
    await expect(
      uploadSandboxFiles({
        accessToken: "synthetic-token",
        files: [file],
        path: "notes",
        guard,
      }),
    ).rejects.toThrow("Reopen the file in the same account and connection");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
  });
});

it.each([
  "https://api-test-recoup.vercel.app",
  "https://api-git-main-recoup.vercel.app",
])("does not enable common mutable alias %s", (origin) => {
  apiState.value = origin;
  vi.stubEnv("NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN", origin);
  expect(getGuardedGitApiBaseUrl()).toBeNull();
});
