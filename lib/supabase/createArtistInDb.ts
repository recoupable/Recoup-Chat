import createArtistAccount from "./artist/createArtistAccount";
import createAccountInfo from "./artist/createAccountInfo";
import getArtistById from "./artist/getArtistById";
import associateArtistWithAccount from "./artist/associateArtistWithAccount";

/**
 * Create a new artist in the database and associate it with an account
 * @param name Name of the artist to create
 * @param account_id ID of the account that will have admin access to the artist
 * @returns Created artist object or null if creation failed
 */
export async function createArtistInDb(name: string, account_id: string) {
  try {
    // Step 1: Create the artist account
    const account = await createArtistAccount(name);
    if (!account) return null;

    // Step 2: Create account info for the artist
    const infoCreated = await createAccountInfo(account.id);
    if (!infoCreated) return null;

    // Step 3: Get the full artist data
    const artist = await getArtistById(account.id);
    if (!artist) return null;

    // Step 4: Associate the artist with the account
    const associated = await associateArtistWithAccount(account_id, account.id);
    if (!associated) return null;

    // Return formatted artist data
    return {
      ...artist,
      account_id: artist.id,
      ...artist.account_info[0],
    };
  } catch (error) {
    console.error("Unexpected error creating artist:", error);
    return null;
  }
}

export default createArtistInDb;
