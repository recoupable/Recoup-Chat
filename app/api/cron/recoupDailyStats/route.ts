import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "recoupDailyStats endpoint is live" },
    { status: 200 }
  );
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
