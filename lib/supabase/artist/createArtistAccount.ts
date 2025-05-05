import supabase from "@/lib/supabase/serverClient";

/**
 * Create a new artist account in the database
 * @param name Name of the artist to create
 * @returns Created account data or null if creation failed
 */
export async function createArtistAccount(name: string) {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .insert({ name })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating artist account:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error creating artist account:", error);
    return null;
  }
}

export default createArtistAccount;
