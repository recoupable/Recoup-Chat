import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");
  const credits = req.nextUrl.searchParams.get("credits");

  try {
    const { data: found } = await supabase
      .from("credits_usage")
      .select("*")
      .eq("account_id", accountId);

    if (found?.length) {
      await supabase
        .from("credits_usage")
        .update({
          ...found[0],
          remaining_credits:
            found[0].remaining_credits - parseInt(credits as string, 10),
        })
        .eq("account_id", accountId);
      return Response.json({ success: true }, { status: 200 });
    }

    return Response.json({ success: false }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
