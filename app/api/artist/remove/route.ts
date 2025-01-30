import { NextRequest, NextResponse } from "next/server";
import { removeArtist } from "@/lib/supabase/removeArtist";

export async function GET(req: NextRequest) {
  try {
    const artistId = req.nextUrl.searchParams.get("artistId");

    if (!artistId) {
      return NextResponse.json(
        { error: "Artist ID is required" },
        { status: 400 }
      );
    }

    const success = await removeArtist(artistId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
