import { z } from "zod";
import { tool } from "ai";
import { generateAndStoreTxtFile } from "@/lib/txtGeneration";
import { IS_PROD } from "../consts";
import generateTxtFileEmail from "../email/generateTxtFileEmail";
import { ArweaveUploadResult } from "../arweave/uploadBase64ToArweave";

// Define the schema for input validation
const schema = z.object({
  contents: z.string().min(1, "Contents are required"),
  account_id: z.string().min(1, "Pull account_id from the system prompt"),
  active_conversation_id: z
    .string()
    .min(1, "Pull active_conversation_id from the system prompt"),
});

/**
 * Interface for TXT file generation result
 */
export interface TxtFileGenerationResult {
  success: boolean;
  arweaveUrl: string | null;
  smartAccountAddress?: string;
  transactionHash?: string | null;
  blockExplorerUrl?: string | null;
  message?: string;
  error?: string;
}

// Define the create_txt_file tool
const createTxtFile = tool({
  description:
    "Create a downloadable TXT file from provided contents. The file will be stored onchain with Arweave and a collection will be created onchain with Base.",
  parameters: schema,
  execute: async ({
    contents,
    account_id,
    active_conversation_id,
  }): Promise<TxtFileGenerationResult> => {
    try {
      // Generate and store the TXT file
      const result = await generateAndStoreTxtFile(contents);
      await generateTxtFileEmail({
        rawTextFile: contents,
        arweaveFile: result.arweave as ArweaveUploadResult,
        accountId: account_id,
        conversationId: active_conversation_id,
      });

      // Create a response in a format useful for the chat interface
      return {
        success: true,
        arweaveUrl: result.arweave?.url || null,
        smartAccountAddress: result.smartAccount.address,
        transactionHash: result.transactionHash,
        blockExplorerUrl: result.transactionHash
          ? `https://${IS_PROD ? "" : "sepolia."}basescan.org/tx/${result.transactionHash}`
          : null,
        message: "TXT file successfully generated and stored onchain.",
      };
    } catch (error) {
      console.error("Error in createTxtFile tool:", error);

      // Format helpful error messages based on common issues
      let errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      if (errorMessage.includes("API key")) {
        errorMessage =
          "OpenAI API key is missing or invalid. Please check your environment variables.";
      } else if (errorMessage.includes("content policy")) {
        errorMessage =
          "Your contents may violate content policy. Please try different contents.";
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }

      return {
        success: false,
        arweaveUrl: null,
        error: errorMessage,
        message: "Failed to generate TXT file. " + errorMessage,
      };
    }
  },
});

export default createTxtFile;
