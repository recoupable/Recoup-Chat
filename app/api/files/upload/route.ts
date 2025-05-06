import { NextResponse } from "next/server";
import { uploadBase64ToArweave } from "@/lib/arweave/uploadBase64ToArweave";

interface FileResponse {
  fileName: string;
  url: string;
  mimetype: string;
  filesize: number;
  id?: string;
  success: boolean;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    
    // Upload to Arweave
    const arweaveResult = await uploadBase64ToArweave(
      base64Data,
      file.type,
      file.name
    );

    // Return file response with Arweave URL
    const fileResponse: FileResponse = {
      fileName: file.name,
      url: arweaveResult.url,
      mimetype: file.type,
      filesize: buffer.byteLength,
      id: arweaveResult.id,
      success: true
    };

    return NextResponse.json(fileResponse);
  } catch (error) {
    console.error("Error uploading file:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}