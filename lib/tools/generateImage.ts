import { z } from "zod";
import { tool } from "ai";
import { generateAndProcessImage } from "@/lib/imageGeneration";
import { IS_PROD } from "../consts";

// Define the schema for input validation
const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
});

/**
 * Interface for image generation result
 */
export interface ImageGenerationResult {
  success: boolean;
  arweaveUrl: string | null;
  smartAccountAddress?: string;
  transactionHash?: string | null;
  blockExplorerUrl?: string | null;
  message?: string;
  error?: string;
}

// Define the generateImage tool
const generateImage = tool({
  description:
    "Generate an image based on a text prompt. The image will be stored onchain with Arweave and a collection will be created onchain with Base.",
  parameters: schema,
  execute: async ({ prompt }): Promise<ImageGenerationResult> => {
    try {
      // Generate the image with the provided prompt
      const result = await generateAndProcessImage(prompt);

      // Create a response in a format useful for the chat interface
      return {
        success: true,
        arweaveUrl: result.arweave?.url || null,
        smartAccountAddress: result.smartAccount.address,
        transactionHash: result.transactionHash,
        blockExplorerUrl: result.transactionHash
          ? `https://${IS_PROD ? "" : "sepolia."}basescan.org/tx/${result.transactionHash}`
          : null,
        message: "Image successfully generated and stored onchain.",
      };
    } catch (error) {
      console.error("Error in generateImage tool:", error);

      // Format helpful error messages based on common issues
      let errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      if (errorMessage.includes("API key")) {
        errorMessage =
          "OpenAI API key is missing or invalid. Please check your environment variables.";
      } else if (errorMessage.includes("content policy")) {
        errorMessage =
          "Your prompt may violate content policy. Please try a different prompt.";
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }

      return {
        success: false,
        arweaveUrl: null,
        error: errorMessage,
        message: "Failed to generate image. " + errorMessage,
      };
    }
  },
});

export default generateImage;
