import { NextRequest } from "next/server";
import copyMessages from "@/lib/supabase/copyMessages";

export async function POST(req: NextRequest) {
  try {
    const {
      sourceRoomId,
      targetRoomId,
      clearExisting = false,
    } = await req.json();

    if (!sourceRoomId || !targetRoomId) {
      return Response.json(
        { error: "Missing required parameters: sourceRoomId and targetRoomId" },
        { status: 400 }
      );
    }

    await copyMessages(sourceRoomId, targetRoomId, clearExisting);

    return Response.json({
      success: true,
      sourceRoomId,
      targetRoomId,
    });
  } catch (error) {
    console.error("Error copying messages:", error);
    return Response.json({ error: "Failed to copy messages" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
