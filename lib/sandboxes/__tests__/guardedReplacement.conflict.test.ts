import { vi, expect, it } from "vitest";
import {
  apiState,
  fetchMock,
  sha,
  file,
  guard,
} from "./guardedReplacement.fixture";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { SandboxFileConflictError } from "@/lib/sandboxes/SandboxFileConflictError";
import { upload } from "@vercel/blob/client";

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
      handleUploadUrl: `${apiState.value}/api/sandboxes/staged-file`,
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
    apiState.value = "https://api-other-recoup.vercel.app";
    return { url: "https://blob.example/draft" } as never;
  });
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
      guard,
    }),
  ).rejects.toThrow("Reopen the file in the same account and connection");
  expect(fetchMock).not.toHaveBeenCalled();
});
