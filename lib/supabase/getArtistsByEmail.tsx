import getFormattedArtist from "../getFormattedArtist";
import supabase from "./serverClient";

const getArtistsByEmail = async (email: string) => {
  const { data: accountEmail } = await supabase
    .from("account_emails")
    .select("*")
    .eq("email", email)
    .single();
  if (!accountEmail) return [];
  const accountId = accountEmail.account_id;
  const { data: artists } = await supabase
    .from("account_artist_ids")
    .select(
      `*,
        artist_info:accounts!account_artist_ids_artist_id_fkey (
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

  const formattedArtists = artists.map((artist) =>
    getFormattedArtist(artist.artist_info),
  );

  return formattedArtists;
};

export default getArtistsByEmail;
