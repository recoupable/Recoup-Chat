import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const referenceId = req.nextUrl.searchParams.get("referenceId");

  try {
    const client = getSupabaseServerAdminClient();
    const { data } = await client
      .from("tiktok_reports")
      .select("*")
      .eq("id", referenceId)
      .single();
    return Response.json({
      message: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
