import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import { getMimeFromPath } from "@/lib/files/getMimeFromPath";
import { getGuardedGitApiBaseUrl } from "./getGuardedGitApiBaseUrl";

interface GetFileContentsResponse {
  status: "success" | "error";
  content?: string;
  encoding?: "base64";
  error?: string;
  sha?: string;
}

interface FileContentsResult {
  content: string | null;
  imageUrl: string | null;
  sha?: string;
}

/**
 * Fetches file content from the sandbox file API.
 * The API auto-detects binary files and returns base64-encoded content.
 * When base64 content is returned, this builds a data URL for image preview.
 */
export async function getFileContents(
  accessToken: string,
  path: string,
  options?: { includeRevision?: boolean },
): Promise<FileContentsResult> {
  const apiBaseUrl = options?.includeRevision
    ? getGuardedGitApiBaseUrl()
    : getClientApiBaseUrl();
  if (!apiBaseUrl)
    throw new Error(
      "Protected replacement is not enabled for this connection.",
    );
  const response = await fetch(
    `${apiBaseUrl}/api/sandboxes/file?path=${encodeURIComponent(path)}${options?.includeRevision ? "&include_revision=true" : ""}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  const data: GetFileContentsResponse = await response.json();

  if (
    !response.ok ||
    data.status === "error" ||
    typeof data.content !== "string"
  ) {
    throw new Error(data.error || "Failed to fetch file contents");
  }
  if (options?.includeRevision && !/^[a-f0-9]{40}$/.test(data.sha ?? "")) {
    throw new Error(
      "This connection did not return an opened file revision. Replacement is blocked.",
    );
  }
  const revision = options?.includeRevision ? { sha: data.sha } : {};

  if (data.encoding === "base64") {
    const mimeType = getMimeFromPath(path);
    return {
      content: null,
      imageUrl: `data:${mimeType};base64,${data.content}`,
      ...revision,
    };
  }

  return { content: data.content, imageUrl: null, ...revision };
}
