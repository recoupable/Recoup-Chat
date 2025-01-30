import { NextRequest, NextResponse } from "next/server";
import { getArtistDetails } from "@/lib/supabase/getArtistDetails";

export async function GET(req: NextRequest) {
  try {
    const artistId = req.nextUrl.searchParams.get("artistId");

    if (!artistId) {
      return NextResponse.json(
        { error: "Artist ID is required" },
        { status: 400 }
      );
    }

    const artist = await getArtistDetails(artistId);
    return NextResponse.json({ artist });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
