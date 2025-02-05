import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");

  try {
    const { data: account } = await supabase
      .from("accounts")
      .select("*, account_info(*), account_socials(*)")
      .eq("id", artistId)
      .single();
    if (!account) throw new Error("failed");

    return Response.json(
      {
        artist: {
          ...account.account_info[0],
          ...account,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
