import { TurboFactory } from "@ardrive/turbo-sdk";
import { Readable } from "node:stream";

// Load and parse the Arweave key
if (!process.env.ARWEAVE_KEY) {
  throw new Error("ARWEAVE_KEY environment variable is not set");
}

const ARWEAVE_KEY = JSON.parse(
  Buffer.from(
    process.env.ARWEAVE_KEY.replace("ARWEAVE_KEY=", ""),
    "base64"
  ).toString()
);

export type ArweaveUploadResult = {
  id: string;
  dataCaches: string[];
  cost: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};

/**
 * Upload a buffer to Arweave
 */
async function uploadBufferToArweave(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
): Promise<ArweaveUploadResult> {
  const fileSize = fileBuffer.length;

  const turbo = TurboFactory.authenticated({
    privateKey: ARWEAVE_KEY,
  });

  const [{ winc: fileSizeCost }] = await turbo.getUploadCosts({
    bytes: [fileSize],
  });

  const fileStreamFactory = () => Readable.from(fileBuffer);

  const { id, dataCaches } = await turbo.uploadFile({
    fileStreamFactory,
    fileSizeFactory: () => fileSize,
    dataItemOpts: {
      tags: [
        {
          name: "Content-Type",
          value: fileType,
        },
        {
          name: "File-Name",
          value: fileName,
        },
        {
          name: "App-Name",
          value: "Recoup-Chat",
        },
        {
          name: "Content-Type-Group",
          value: "image",
        },
      ],
    },
  });

  return {
    id,
    dataCaches,
    cost: fileSizeCost,
    fileName,
    fileType,
    fileSize,
    url: `https://arweave.net/${id}`,
  };
}

/**
 * Upload a base64 string to Arweave
 */
export async function uploadBase64ToArweave(
  base64Data: string,
  mimeType: string = "image/png",
  filename: string = "generated-image.png"
): Promise<ArweaveUploadResult> {
  const fileBuffer = Buffer.from(base64Data, "base64");

  return uploadBufferToArweave(fileBuffer, filename, mimeType);
}
