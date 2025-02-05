import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const account_id = req.nextUrl.searchParams.get("account_id");

  try {
    const { data: account } = await supabase
      .from("accounts")
      .insert({
        name,
      })
      .select("*")
      .single();
    await supabase.from("account_info").insert({
      account_id: account.id,
    });

    const { data: artist } = await supabase
      .from("accounts")
      .select("*, account_socials(*), account_info(*)")
      .eq("id", account.id)
      .single();

    await supabase.from("account_artist_ids").insert({
      account_id,
      artist_id: account.id,
    });
    return Response.json(
      {
        artist: {
          ...artist,
          account_id: artist.id,
          ...artist.account_info[0],
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
