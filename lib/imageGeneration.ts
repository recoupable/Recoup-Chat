import generateImage from "./ai/generateImage";
import { ArweaveUploadResult } from "@/lib/arweave/uploadBase64ToArweave";
import createCollection from "@/app/api/in_process/createCollection";
import { uploadMetadataJson } from "./arweave/uploadMetadataJson";

export interface GeneratedImageResponse {
  arweave?: ArweaveUploadResult | null;
  smartAccount: {
    address: string;
    [key: string]: unknown;
  };
  transactionHash: string | null;
}

export async function generateAndProcessImage(
  prompt: string
): Promise<GeneratedImageResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OpenAI API key is missing. Please add it to your environment variables."
    );
  }

  if (!prompt) {
    throw new Error("Prompt is required");
  }

  // Generate the image using OpenAI
  const image = await generateImage(prompt);

  const metadataArweave = await uploadMetadataJson({
    image: `ar://${image?.id}`,
    content: {
      mime: image?.fileType || "image/png",
      uri: `ar://${image?.id}` || "",
    },
    description: prompt,
    name: prompt,
  });

  // Create a collection on the blockchain using the metadata id
  const result = await createCollection({
    collectionName: prompt,
    uri: image ? `ar://${metadataArweave.id}` : "",
  });
  const transactionHash = result.transactionHash || null;

  // Return complete response
  return {
    arweave: image,
    smartAccount: result.smartAccount,
    transactionHash,
  };
}
