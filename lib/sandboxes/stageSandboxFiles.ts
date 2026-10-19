import { upload } from "@vercel/blob/client";

/** Share existing blob staging without changing the selected commit condition. */
export async function stageSandboxFiles(
  accessToken: string,
  files: File[],
  apiBaseUrl: string,
  expectedSha?: string,
) {
  const results = await Promise.allSettled(
    files.map(async (file) => {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: `${apiBaseUrl}/api/sandboxes/staged-file`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        url: blob.url,
        name: file.name,
        ...(expectedSha && { expected_sha: expectedSha }),
      };
    }),
  );
  const blobFiles: { url: string; name: string; expected_sha?: string }[] = [];
  const blobErrors: string[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") blobFiles.push(result.value);
    else
      blobErrors.push(
        `${files[index].name}: ${result.reason?.message || "Upload failed"}`,
      );
  });
  if (!blobFiles.length)
    throw new Error(
      blobErrors[0] || "Failed to upload files to temporary storage",
    );
  return { blobFiles, blobErrors };
}
