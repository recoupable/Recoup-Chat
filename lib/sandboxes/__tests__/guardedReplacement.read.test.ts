import { expect, it } from "vitest";
import { apiState, fetchMock, sha, opened } from "./guardedReplacement.fixture";
import { getFileContents } from "../getFileContents";

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
    `${apiState.value}/api/sandboxes/file?path=notes%2Fdraft.txt&include_revision=true`,
    expect.anything(),
  );
});

it("rejects a predecessor response with no revision instead of falling back", async () => {
  fetchMock.mockResolvedValue(
    Response.json({ status: "success", content: "Legacy response" }),
  );
  await expect(
    getFileContents("synthetic-token", opened.path, { includeRevision: true }),
  ).rejects.toThrow("did not return an opened file revision");
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
