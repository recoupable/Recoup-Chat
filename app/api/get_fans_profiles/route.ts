import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");
  try {
    const { data } = await supabase
      .from("fans_segments")
      .select("*")
      .eq("artistId", artistId);

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
