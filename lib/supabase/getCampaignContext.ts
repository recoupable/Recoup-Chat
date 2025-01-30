import getBaseCampaign from "@/lib/chat/getBaseCampaign";

/**
 * Gets campaign context for an artist and email
 * @param artistId The artist ID to get campaign for
 * @param email The email to get campaign for
 * @returns Campaign context data
 * @throws Error if required parameters are missing or if there's an error getting the campaign
 */
export async function getCampaignContext(artistId: string, email: string) {
  if (!artistId || !email) {
    throw new Error("Artist ID and email are required");
  }

  return await getBaseCampaign(artistId, email);
}
