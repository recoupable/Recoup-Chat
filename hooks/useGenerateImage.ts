import { useState } from "react";

interface GeneratedImageResponse {
  image: {
    mimeType: string;
  };
  arweave?: {
    id: string;
    url: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  smartAccount: any;
  transactionHash: string;
}

export function useGenerateImage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arweaveUri, setArweaveUri] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [smartAccount, setSmartAccount] = useState<any | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setArweaveUri(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate image");
      }

      const { arweave, smartAccount, transactionHash } =
        data as GeneratedImageResponse;

      // Set Arweave URL if available
      if (arweave && arweave.url) {
        setArweaveUri(arweave.url);
      }

      setSmartAccount(smartAccount);
      setTransactionHash(transactionHash);
    } catch (err) {
      console.error("Error details:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      // More specific error messages based on common issues
      let displayError = errorMessage;
      if (errorMessage.includes("API key")) {
        displayError =
          "OpenAI API key is missing or invalid. Please check your environment variables.";
      } else if (errorMessage.includes("content policy")) {
        displayError =
          "Your prompt may violate content policy. Please try a different prompt.";
      } else if (errorMessage.includes("rate limit")) {
        displayError = "Rate limit exceeded. Please try again later.";
      }

      setError(displayError);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setError(null);
    setArweaveUri(null);
  };

  return {
    generateImage,
    isGenerating,
    error,
    arweaveUri,
    smartAccount,
    transactionHash,
    reset,
  };
}
