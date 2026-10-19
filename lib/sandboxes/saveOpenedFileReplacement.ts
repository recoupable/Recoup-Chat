import { uploadSandboxFiles } from "./uploadSandboxFiles";
import type { PendingFileReplacement } from "./guardedFileTypes";

/** One authenticated attempt against the original opened context; no retry. */
export async function saveOpenedFileReplacement(
  getAccessToken: () => Promise<string | null>,
  original: PendingFileReplacement,
  isCurrent: () => boolean,
): Promise<void> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Please sign in to replace this file.");
  if (!isCurrent())
    throw new Error(
      "The account, file or connection changed. Reopen before replacing.",
    );
  await uploadSandboxFiles({
    accessToken,
    files: [original.file],
    path: original.opened.path.split("/").slice(0, -1).join("/"),
    guard: { opened: original.opened, isCurrent },
  });
}
