import { type NextRequest, NextResponse } from "next/server";
import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";
import { uploadBase64ToArweave } from "@/lib/arweave/uploadBase64ToArweave";
import createCollection from "@/app/api/in_process/createCollection";

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          message:
            "OpenAI API key is missing. Please add it to your environment variables.",
        },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate the image using OpenAI
    const { image } = await generateImage({
      model: openai.image("gpt-image-1"),
      prompt,
      providerOptions: {
        openai: { quality: "high" },
      },
    });

    // Upload the generated image to Arweave
    let arweaveData = null;
    try {
      const arweaveResult = await uploadBase64ToArweave(
        // @ts-expect-error image.base64Data is not typed
        image.base64Data,
        image.mimeType,
        `generated-image-${Date.now()}.png`
      );
      arweaveData = {
        id: arweaveResult.id,
        url: arweaveResult.url,
      };
    } catch (arweaveError) {
      console.error("Error uploading to Arweave:", arweaveError);
      // We'll continue and return the image even if Arweave upload fails
    }

    const { transactionHash, smartAccount } = await createCollection(prompt);

    // Return both the image and Arweave data
    return NextResponse.json({
      image,
      arweave: arweaveData,
      smartAccount,
      transactionHash,
    });
  } catch (error) {
    console.error("Error generating image:", error);

    // Ensure we always return a proper JSON response
    return NextResponse.json(
      {
        message: `Failed to generate image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        error: error instanceof Error ? error.toString() : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
