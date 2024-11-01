import { ArtistRecord, CampaignRecord } from "@/types/Artist";
import { ArtistToolResponse } from "@/types/Tool";
import { v4 as uuidV4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getToolCallMessage = (toolName: string | undefined, context: any) => {
  if (
    toolName === "createArtist" &&
    context.status === ArtistToolResponse.CREATED_ARTIST
  )
    return {
      id: uuidV4(),
      content: `Name: ${context.data.name}, ID: ${context.data.id}`,
      role: "assistant",
    };
  if (toolName === "getArtists")
    return {
      id: uuidV4(),
      content: `${context.artists.length ? context.artists.map((artist: ArtistRecord) => artist.name).join(",") : "You don't manage any artists."}`,
      role: "assistant",
    };

  if (
    toolName === "createCampaign" &&
    context.status === ArtistToolResponse.CREATED_CAMPAIGN
  )
    return {
      id: uuidV4(),
      content: `Campaign Id: ${context.data.id}`,
      role: "assistant",
    };
  if (toolName === "getCampaigns")
    return {
      id: uuidV4(),
      content: `${context?.campaigns.length ? context?.campaigns?.map((campaign: CampaignRecord) => campaign.id).join(",") : "You don't manage any campaigns."}`,
      role: "assistant",
    };
  return null;
};

export default getToolCallMessage;
