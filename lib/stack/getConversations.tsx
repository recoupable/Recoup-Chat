import { Address, getAddress } from "viem";
import getStackClient from "./getStackClient";
import { CHAT_POINT_SYSTEM_ID } from "../consts";

const getConversations = async (walletAddress: Address) => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);

  const metrics = await stackClient.getEventMetrics({
    query: stackClient
      .eventsQuery()
      .where({
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
          associatedAccount: getAddress(walletAddress),
        })
        .offset(chunkSize * i)
        .build(),
    });
    events = events.concat(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chats = events.filter((event: any) => event?.metadata?.conversationId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aggregation: any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chats.forEach((item: any) => {
    const event = item.event;

    if (!aggregation[event]) {
      aggregation[event] = {
        ...item,
        title: item?.metadata?.title || "",
      };
    }
    if (item?.metadata?.title) {
      aggregation[event].title = item.metadata.title;
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.values(aggregation) as any;
};

export default getConversations;
