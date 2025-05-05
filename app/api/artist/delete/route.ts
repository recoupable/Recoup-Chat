import { NextRequest } from "next/server";
import deleteArtistFromAccount from "@/lib/supabase/deleteArtistFromAccount";

/**
 * API endpoint to delete an artist association from an account
 * If no other accounts have this artist, also deletes the artist account and related data
 *
 * @param req Request object containing artistAccountId
 * @returns JSON response with success status and message
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artistAccountId } = body;

    if (!artistAccountId) {
      return Response.json(
        { success: false, message: "Missing artistAccountId parameter" },
        { status: 400 }
      );
    }

    const result = await deleteArtistFromAccount(artistAccountId);

    if (result.success) {
      return Response.json(result, { status: 200 });
    } else {
      return Response.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Error in delete artist API:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ success: false, message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
