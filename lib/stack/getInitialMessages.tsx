import { Address, getAddress } from "viem";
import getStackClient from "./getStackClient";
import { Message } from "ai";
import { CHAT_POINT_SYSTEM_ID, MESSAGE_SENT_EVENT } from "../consts";
import { StackMessage } from "@/types/Stack";

const getInitialMessages = async (
  walletAddress: Address,
  conversationId: string,
) => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);

  const events = await stackClient.getEvents({
    query: stackClient
      .eventsQuery()
      .where({
        eventType: `${MESSAGE_SENT_EVENT}-${conversationId}`,
        associatedAccount: getAddress(walletAddress),
      })
      .offset(0)
      .build(),
  });
  const messages: StackMessage[] = events.map((event) => {
    const data = {
      id: event.metadata.id,
      content: event.metadata.content,
      role: event.metadata.role as Message["role"],
      createdAt: new Date(event.timestamp),
      metadata: {
        ...event.metadata,
      },
    } as StackMessage;
    if (event.metadata.role === "assistant")
      data.questionId = event.metadata.questionId;
    return data;
  });
  messages.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  const titleMessage = messages.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (message: any) => message?.metadata?.title,
  );
  return {
    messages,
    titleMessage,
  };
};

export default getInitialMessages;
