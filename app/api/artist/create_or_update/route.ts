import createSocialByLink from "@/lib/supabase/createSocialByLink";
import updateArtistProfile from "@/lib/supabase/updateArtistProfile";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const image = body.image;
  const name = body.name;
  const artistId = body.artistId;
  const email = body.email;
  const profileUrls = body.profileUrls;
  const label = body.label;
  const instruction = body.instruction;
  const knowledges = body.knowledges;

  try {
    const client = getSupabaseServerAdminClient();
    const artistAccountId = await updateArtistProfile(
      artistId,
      email,
      image,
      name,
      instruction,
      label,
      knowledges,
    );

    await Promise.all(
      profileUrls.map(
        async (url: string) => await createSocialByLink(artistId, url),
      ),
    );

    const { data: account } = await client
      .from("accounts")
      .select("*, account_info(*), account_socials(*, socials(*))")
      .eq("id", artistAccountId)
      .single();

    if (!account) throw new Error("failed");

    return Response.json(
      {
        artist: account,
        artist_id: artistAccountId,
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
