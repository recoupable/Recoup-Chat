import { NextRequest, NextResponse } from "next/server";
import { increaseCredits } from "@/lib/supabase/credits";

export async function GET(req: NextRequest) {
  try {
    const accountId = req.nextUrl.searchParams.get("accountId");
    const amount = req.nextUrl.searchParams.get("amount");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const credits = await increaseCredits(
      accountId,
      amount ? parseInt(amount, 10) : undefined
    );
    return NextResponse.json({ credits });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
