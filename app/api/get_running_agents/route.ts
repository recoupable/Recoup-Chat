import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { STEP_OF_ANALYSIS } from "@/types/Funnel";

export async function GET(req: NextRequest) {
  try {
    const artistId = req.nextUrl.searchParams.get("artistId");

    if (!artistId) {
      return NextResponse.json(
        { error: "Artist ID is required" },
        { status: 400 }
      );
    }

    const client = getSupabaseServerAdminClient();
    const { data, error } = await client
      .from("funnel_analytics")
      .select("*")
      .gt("status", STEP_OF_ANALYSIS.UNKNOWN_PROFILE)
      .eq("artistId", artistId)
      .order("timestamp", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
