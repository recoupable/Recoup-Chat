import type { NextRequest } from "next/server";
import { copyConversation } from "@/lib/supabase/copyConversation";

/**
 * POST endpoint to copy conversation from one room to another with a new artist
 */
export async function POST(req: NextRequest) {
  try {
    const { sourceRoomId, artistId } = await req.json();

    if (!sourceRoomId || !artistId) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Copy the conversation to a new room with the new artist
    const newRoomId = await copyConversation(sourceRoomId, artistId);

    if (!newRoomId) {
      return Response.json(
        { error: "Failed to copy conversation" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      newRoomId,
      originalRoomId: sourceRoomId,
      artistId,
    });
  } catch (error) {
    console.error("Error processing room copy request:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Ensure this API route is never cached
export const dynamic = "force-dynamic";
export const revalidate = 0;
