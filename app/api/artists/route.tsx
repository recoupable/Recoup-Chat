import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  try {
    if (!accountId) {
      return Response.json(
        { message: "Missing accountId param" },
        { status: 400 }
      );
    }
    const result = await getAccountArtistIds({ accountIds: [accountId] });
    return Response.json(
      {
        artists: result,
      },
      { status: 200 }
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
