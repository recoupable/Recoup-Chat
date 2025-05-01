import { type NextRequest, NextResponse } from "next/server";
import { generateAndProcessImage } from "@/lib/imageGeneration";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    // Use the unified function to generate image and handle all related processes
    const result = await generateAndProcessImage(prompt);

    // Return the result
    return NextResponse.json(result);
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
