import { Address } from "viem";
import getStackClient from "./getStackClient";
import {
  CHAT_POINT_SYSTEM_ID,
  CONVERSATION_CREATE_EVENT,
  MESSAGE_SENT_POINT,
} from "../consts";

const trackNewConversation = async (
  address: Address,
  id: string,
  name: string,
) => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);
  const uniqueId = `${address}-${Date.now()}`;
  const eventName = CONVERSATION_CREATE_EVENT;
  await stackClient.track(eventName, {
    points: MESSAGE_SENT_POINT,
    account: address,
    uniqueId,
    metadata: {
      id,
      name,
    },
  });
};

export default trackNewConversation;
