import supabase from "./serverClient";

const readArtists = async (userEmail: string) => {
  const { data: userData } = await supabase
    .from("accounts")
    .select("*")
    .eq("email", userEmail);

  let user = userData?.[0];

  if (!userData?.length) {
    const newUserData = await supabase
      .from("accounts")
      .insert({
        email: userEmail,
        timestamp: Date.now(),
        artistIds: [],
      })
      .select("*")
      .single();
    user = newUserData;
  }

  const { data: artists, error } = await supabase
    .from("artists")
    .select("*")
    .in("id", user.artistIds || []);

  if (error) throw error;

  return artists || [];
};

export default readArtists;
