import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const instruction = body.instruction;
  const name = body.name;
  const organization = body.organization;
  const accountId = body.accountId;

  const client = getSupabaseServerAdminClient();

  try {
    const { data: found } = await client
      .from("accounts")
      .select("*")
      .eq("id", accountId);

    if (found?.length) {
      const { data } = await client
        .from("accounts")
        .update({
          ...found[0],
          instruction,
          name,
          organization,
        })
        .eq("id", accountId)
        .single();

      return Response.json({ data }, { status: 200 });
    }

    return Response.json({ data: null }, { status: 400 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
