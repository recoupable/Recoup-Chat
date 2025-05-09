import getAccountById from "@/lib/supabase/accounts/getAccountById";
import updateAccount from "@/lib/supabase/accounts/updateAccount";
import getAccountInfoById from "@/lib/supabase/accountInfo/getAccountInfoById";
import updateAccountInfo from "@/lib/supabase/accountInfo/updateAccountInfo";
import insertAccountInfo from "@/lib/supabase/accountInfo/insertAccountInfo";
import getAccountByEmail from "@/lib/supabase/accounts/getAccountByEmail";
import insertAccount from "@/lib/supabase/accounts/insertAccount";
import insertAccountArtistId from "@/lib/supabase/accountArtistIds/insertAccountArtistId";

const updateArtistProfile = async (
  artistId: string,
  email: string,
  image: string,
  name: string,
  instruction: string,
  label: string,
  knowledges: string
) => {
  if (artistId) {
    // Fetch current account and account_info
    const currentAccount = await getAccountById(artistId);
    if (!currentAccount) throw Error("artist does not exist.");

    // Only update fields that are non-empty
    const accountUpdate: Partial<typeof currentAccount> = {};
    if (name) accountUpdate.name = name;
    if (Object.keys(accountUpdate).length > 0) {
      await updateAccount(artistId, accountUpdate);
    }

    const account_info = await getAccountInfoById(artistId);
    if (account_info) {
      // Only update fields that are non-empty, otherwise keep existing
      const infoUpdate: Partial<typeof account_info> = {};
      infoUpdate.image = image || account_info.image;
      infoUpdate.instruction = instruction || account_info.instruction;
      infoUpdate.knowledges = knowledges || account_info.knowledges;
      infoUpdate.label = label || account_info.label;
      await updateAccountInfo(artistId, infoUpdate);
    } else {
      await insertAccountInfo({
        image,
        instruction,
        knowledges,
        label,
        account_id: artistId,
      });
    }
    return artistId;
  } else {
    const emailRecord = await getAccountByEmail(email);
    if (!emailRecord) throw Error("account email does not exist.");
    const newArtistAccount = await insertAccount({ name });
    if (!newArtistAccount) throw Error("failed to create new artist account");
    await insertAccountArtistId({
      account_id: emailRecord.account_id,
      artist_id: newArtistAccount.id,
    });
    await insertAccountInfo({
      image,
      instruction,
      knowledges,
      label,
      account_id: newArtistAccount.id,
    });
    return newArtistAccount.id;
  }
};

export default updateArtistProfile;
