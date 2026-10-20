import { vi, expect, it } from "vitest";
import {
  fetchMock,
  sha,
  file,
  opened,
  guard,
} from "./guardedReplacement.fixture";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { upload } from "@vercel/blob/client";

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
  ).rejects.toThrow("Reopen the file in the same account and connection");
  await expect(
    uploadSandboxFiles({
      accessToken: "synthetic-token",
      files: [file],
      path: "notes",
      guard: { opened, isCurrent: () => false },
    }),
  ).rejects.toThrow("Reopen the file in the same account and connection");
  expect(upload).not.toHaveBeenCalled();
  expect(fetchMock).not.toHaveBeenCalled();
});
