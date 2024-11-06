import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const image = body.image;
  const name = body.name;
  const artistId = body.artistId;

  try {
    const client = getSupabaseServerAdminClient();
    const { data } = await client
      .from("artists")
      .select("*")
      .eq("id", artistId);

    if (!data || !data?.length) throw Error("artist is not existed.");

    const artistData = data[0];

    await client
      .from("artists")
      .update({
        ...artistData,
        image,
        name,
      })
      .eq("id", artistId);

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;