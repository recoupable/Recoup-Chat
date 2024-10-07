import { Address, getAddress } from "viem";
import getStackClient from "./getStackClient";
import { Message } from "ai";
import { CHAT_POINT_SYSTEM_ID, MESSAGE_SENT_EVENT } from "../consts";

const getInitialMessages = async (walletAddress: Address) => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);

  const events = await stackClient.getEvents({
    query: stackClient
      .eventsQuery()
      .where({
        eventType: MESSAGE_SENT_EVENT,
        associatedAccount: getAddress(walletAddress),
      })
      .offset(0)
      .build(),
  });
  const messages: Message[] = events.map((event) => ({
    id: event.metadata.id,
    content: event.metadata.content,
    role: event.metadata.role as Message["role"],
    createdAt: new Date(event.timestamp),
  }));
  messages.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  return messages;
};

export default getInitialMessages;
