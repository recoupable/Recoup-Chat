import saveFile from "@/lib/ipfs/saveFile";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log('Received IPFS upload request');
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      console.error('No file found in request');
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'File size too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Invalid file type. Please upload an image file.' }, { status: 400 });
    }
    
    console.log('File received:', file.name, file.type, file.size);
    
    // Create a new FormData instance for the Pinata request
    const pinataData = new FormData();
    pinataData.append("file", file);
    pinataData.append("pinataMetadata", JSON.stringify({ name: file.name }));
    
    try {
      const cid = await saveFile(pinataData);
      console.log('File uploaded successfully, CID:', cid);
      return Response.json({ cid }, { status: 200 });
    } catch (uploadError) {
      console.error('Error uploading to Pinata:', uploadError);
      // Check for specific Pinata error messages
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
      if (errorMessage.includes('plan usage limit')) {
        return Response.json({ 
          error: 'Storage limit reached. Please try again later.' 
        }, { status: 429 }); // 429 Too Many Requests
      }
      return Response.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in IPFS upload route:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' }, 
      { status: 500 }
    );
  }
}
