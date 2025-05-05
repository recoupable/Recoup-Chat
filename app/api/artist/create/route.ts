import { NextRequest } from "next/server";
import { createArtistInDb } from "@/lib/supabase/createArtistInDb";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const account_id = req.nextUrl.searchParams.get("account_id");

  if (!name || !account_id) {
    return Response.json(
      { message: "Missing required parameters: name and account_id" },
      { status: 400 }
    );
  }

  try {
    const artist = await createArtistInDb(name, account_id);

    if (!artist) {
      return Response.json(
        { message: "Failed to create artist" },
        { status: 500 }
      );
    }

    return Response.json({ artist }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
