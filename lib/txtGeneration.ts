import { uploadBase64ToArweave } from "@/lib/arweave/uploadBase64ToArweave";
import createCollection from "@/app/api/in_process/createCollection";

export interface GeneratedTxtResponse {
  txt: {
    base64Data: string;
    mimeType: string;
  };
  arweave?: {
    id: string;
    url: string;
  } | null;
  smartAccount: {
    address: string;
    [key: string]: unknown;
  };
  transactionHash: string | null;
}

export async function generateAndStoreTxtFile(
  contents: string
): Promise<GeneratedTxtResponse> {
  if (!contents) {
    throw new Error("Contents are required");
  }

  // Encode contents to base64
  const base64Data = Buffer.from(contents, "utf-8").toString("base64");
  const mimeType = "text/plain";
  const filename = `generated-text-${Date.now()}.txt`;

  // Upload the TXT file to Arweave
  let arweaveData = null;
  try {
    const arweaveResult = await uploadBase64ToArweave(
      base64Data,
      mimeType,
      filename
    );
    arweaveData = {
      id: arweaveResult.id,
      url: arweaveResult.url,
    };
  } catch (arweaveError) {
    console.error("Error uploading TXT to Arweave:", arweaveError);
    // Continue and return the TXT even if Arweave upload fails
  }

  // Create a collection on the blockchain
  const result = await createCollection(contents);
  const transactionHash = result.transactionHash || null;

  return {
    txt: {
      base64Data,
      mimeType,
    },
    arweave: arweaveData,
    smartAccount: result.smartAccount,
    transactionHash,
  };
}
