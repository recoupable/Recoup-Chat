import { NextRequest, NextResponse } from "next/server";
import { saveFunnelReport } from "@/lib/supabase/funnelReport";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = await saveFunnelReport(body);

    return NextResponse.json({
      success: true,
      id: report.id,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
