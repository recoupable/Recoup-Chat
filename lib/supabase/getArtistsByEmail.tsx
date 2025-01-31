import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const getArtistsByEmail = async (email: string) => {
  const client = getSupabaseServerAdminClient();
  const { data: accountEmail } = await client
    .from("account_emails")
    .select("*")
    .eq("email", email)
    .single();
  if (!accountEmail) return Response.json({ artists: [] }, { status: 200 });
  const accountId = accountEmail.account_id;
  const { data: artists } = await client
    .from("account_artist_ids")
    .select(
      `*,
        artist:accounts!account_artist_ids_artist_id_fkey (
          *, 
          account_socials (
            *, 
            social:socials (
              *
            )
          ),
          account_info (
            *
          )
        )  
      `,
    )
    .eq("account_id", accountId);

  if (!artists) return [];

  return artists;
};

export default getArtistsByEmail;
