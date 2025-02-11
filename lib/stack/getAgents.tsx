import { Address, getAddress } from "viem";
import getStackClient from "./getStackClient";
import { CHAT_POINT_SYSTEM_ID, NEW_AGENT_EVENT } from "../consts";

export interface AgentEvent {
  agentId: string;
  title: string;
  platform: string;
  updated_at: string;
}

const getAgents = async (
  artistId: string,
  walletAddress: Address,
): Promise<AgentEvent[]> => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);

  const metrics = await stackClient.getEventMetrics({
    query: stackClient
      .eventsQuery()
      .where({
        eventType: `${NEW_AGENT_EVENT}-${walletAddress}-${artistId}`,
        associatedAccount: getAddress(walletAddress),
      })
      .offset(0)
      .build(),
  });

  const chunkSize = 100;
  const chunkCount =
    parseInt(Number(metrics.totalEvents / chunkSize).toFixed(0), 10) + 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let events: any = [];

  for (let i = 0; i < chunkCount; i++) {
    const data = await stackClient.getEvents({
      query: stackClient
        .eventsQuery()
        .where({
          eventType: `${NEW_AGENT_EVENT}-${walletAddress}-${artistId}`,
          associatedAccount: getAddress(walletAddress),
        })
        .offset(chunkSize * i)
        .build(),
    });
    events = events.concat(data);
  }

  return (
    events
      // eslint-disable-next-line
      .map((event: any) =>
        event.metadata
          ? {
              ...event?.metadata,
              updated_at: event.timestamp,
            }
          : null,
      )
      // eslint-disable-next-line
      .filter((event: any) => event)
  );
};

export default getAgents;
