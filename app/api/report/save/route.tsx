import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const report = body.report;
  const summary = body.summary;
  const next_steps = body.nextSteps;
  const stack_unique_id = body.stackUniqueId;

  try {
    const client = getSupabaseServerAdminClient();
    const { data } = await client
      .from("tiktok_reports")
      .insert({
        report,
        summary,
        next_steps,
        stack_unique_id,
      })
      .select("*")
      .single();

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
