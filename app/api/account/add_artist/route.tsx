import { NextRequest, NextResponse } from "next/server";
import { addArtistToAccount } from "@/lib/supabase/addArtistToAccount";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const artistId = req.nextUrl.searchParams.get("artistId");

    if (!email || !artistId) {
      return NextResponse.json(
        { error: "Email and artistId are required" },
        { status: 400 }
      );
    }

    const success = await addArtistToAccount(email, artistId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Account not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
