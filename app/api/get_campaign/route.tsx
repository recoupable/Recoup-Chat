import { NextRequest, NextResponse } from "next/server";
import { getCampaignContext } from "@/lib/supabase/getCampaignContext";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const artistId = req.nextUrl.searchParams.get("artistId");

    if (!email || !artistId) {
      return NextResponse.json(
        { error: "Email and artist ID are required" },
        { status: 400 }
      );
    }

    const data = await getCampaignContext(artistId, email);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
