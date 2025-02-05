import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const socialIds = body.socialIds;

  try {
    const client = getSupabaseServerAdminClient();
    const { data: account_socials } = await client
      .from("account_socials")
      .select("*, account:accounts(*)")
      .in("social_id", socialIds);
    if (!account_socials) throw new Error("failed");

    const accountIds = account_socials.map(
      (account_social) => account_social.account.id,
    );
    const artistIds = [...new Set(accountIds)];

    return Response.json({ artistIds }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
