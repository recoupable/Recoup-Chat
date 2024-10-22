import { Address, getAddress } from "viem";
import getStackClient from "./getStackClient";
import { CHAT_POINT_SYSTEM_ID, CONVERSATION_CREAT_EVENT } from "../consts";
import { Conversation } from "@/types/Stack";

const getConversations = async (walletAddress: Address) => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);

  const events = await stackClient.getEvents({
    query: stackClient
      .eventsQuery()
      .where({
        eventType: CONVERSATION_CREAT_EVENT,
        associatedAccount: getAddress(walletAddress),
      })
      .offset(0)
      .build(),
  });

  return events.map((event) => ({
    name: event.metadata.name,
    id: event.metadata.id,
  })) as Conversation[];
};

export default getConversations;
