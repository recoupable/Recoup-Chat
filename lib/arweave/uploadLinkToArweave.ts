import {
  ArweaveUploadResult,
  uploadBase64ToArweave,
} from "@/lib/arweave/uploadBase64ToArweave";

/**
 * Uploads an image from a remote URL to Arweave and returns the Arweave URL.
 * Falls back to the original URL if upload fails.
 *
 * @param imageUrl The remote image URL
 * @returns The Arweave URL or the original URL if upload fails
 */
export default async function uploadLinkToArweave(
  imageUrl: string
): Promise<ArweaveUploadResult | null> {
  try {
    const imgRes = await fetch(imageUrl);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const imgBase64 = imgBuffer.toString("base64");
    const mimeType = imgRes.headers.get("content-type") || "image/png";

    // Try to extract filename from Content-Disposition header
    let filename: string | undefined;
    const contentDisp = imgRes.headers.get("content-disposition");
    if (contentDisp) {
      const match = contentDisp.match(/filename="?([^";]+)"?/);
      if (match) {
        filename = match[1];
      }
    }
    // Fallback to filename from URL
    if (!filename) {
      filename = imageUrl.split("?")[0].split("/").pop();
    }
    // Ensure file extension matches mimeType
    const extFromMime = mimeType.split("/")[1] || "png";
    if (!filename || !filename.includes(".")) {
      filename = `profile.${extFromMime}`;
    } else {
      // Replace extension if it doesn't match mimeType
      filename = filename.replace(/\.[^.]+$/, `.${extFromMime}`);
    }

    const arweaveResult = await uploadBase64ToArweave(
      imgBase64,
      mimeType,
      filename
    );
    return arweaveResult;
  } catch (err) {
    console.error("Failed to upload image to Arweave, using original:", err);
    return null;
  }
}
