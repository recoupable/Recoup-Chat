import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const stripeAccountId = req.nextUrl.searchParams.get("stripeAccountId");
  const client = getSupabaseServerAdminClient();

  try {
    const { data: found } = await client
      .from("accounts")
      .select("*")
      .eq("email", email);

    if (found?.length) {
      await client
        .from("accounts")
        .update({
          ...found[0],
          stripeAccountId,
        })
        .eq("id", found[0].id);
      return Response.json({ success: true }, { status: 200 });
    }
    return Response.json({ message: "Not found account." }, { status: 400 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
