import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  try {
    const { data: found } = await supabase
      .from("credits_usage")
      .select("*")
      .eq("account_id", accountId);

    if (found?.length)
      return Response.json({ data: found[0] }, { status: 200 });

    return Response.json({ data: null }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
