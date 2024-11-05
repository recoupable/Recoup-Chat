import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  try {
    const client = getSupabaseServerAdminClient();
    const { data } = await client
      .from("accounts")
      .select("*")
      .eq("email", email);
    if (!data || !data?.length)
      return Response.json({ artists: [] }, { status: 200 });

    const user = data[0];
    const artistIds = user.artistIds || [];
    const { data: artists } = await client
      .from("artists")
      .select("*")
      .in("id", artistIds);
    return Response.json({ artists }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
