import {
  CHAT_POINT_SYSTEM_ID,
  MESSAGE_SENT_POINT,
  NEW_AGENT_EVENT,
} from "../consts";
import getStackClient from "./getStackClient";

const trackAgent = async (
  address: string | null,
  username: string,
  artistId: string,
  agentId: string,
  funnelName: string,
) => {
  try {
    const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);
    const uniqueId = `${address}-${Date.now()}`;
    await stackClient.track(`${NEW_AGENT_EVENT}-${address}-${artistId}`, {
      points: MESSAGE_SENT_POINT,
      account: address || "",
      uniqueId,
      metadata: {
        agentId,
        title: `${funnelName.toUpperCase()} Analysis: ${username}`,
        platform: funnelName,
      },
    });
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export default trackAgent;
