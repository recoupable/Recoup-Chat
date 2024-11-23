import updateArtistProfile from "@/lib/supabase/updateArtistProfile";
import updateArtistSocials from "@/lib/supabase/updateArtistSocials";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const image = body.image;
  const name = body.name;
  const artistId = body.artistId;
  const email = body.email;
  const tiktok_url = body.tiktok_url;
  const youtube_url = body.youtube_url;
  const apple_url = body.apple_url;
  const instagram_url = body.instagram_url;
  const twitter_url = body.twitter_url;
  const spotify_url = body.spotify_url;

  try {
    const id = await updateArtistProfile(artistId, email, image, name);

    await updateArtistSocials(
      artistId,
      tiktok_url,
      youtube_url,
      apple_url,
      instagram_url,
      twitter_url,
      spotify_url,
    );
    return Response.json({ message: "success", artistId: id }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
