import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    const { data: found } = await supabase
      .from("accounts")
      .select("*")
      .eq("email", email);

    if (found?.length) {
      const artistIds = found[0].artistIds;
      if (artistIds.includes(artistId))
        return Response.json({ success: true }, { status: 200 });
      await supabase
        .from("accounts")
        .update({
          ...found[0],
          artistIds: [...artistIds, artistId],
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
