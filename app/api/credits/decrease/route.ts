import { NextRequest, NextResponse } from "next/server";
import { decreaseCredits } from "@/lib/supabase/credits";

export async function GET(req: NextRequest) {
  try {
    const accountId = req.nextUrl.searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const credits = await decreaseCredits(accountId);
    return NextResponse.json({ credits });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("No credits") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
