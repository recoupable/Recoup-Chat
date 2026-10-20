// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import { identity, token, client, wrapper } from "./sandboxRevision.fixture";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { getFileContents } from "@/lib/sandboxes/getFileContents";
import useSandboxFileContent from "../useSandboxFileContent";

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
  identity.actor = "actor-b";
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
