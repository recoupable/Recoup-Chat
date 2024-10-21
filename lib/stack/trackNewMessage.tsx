import { Address } from "viem";
import getStackClient from "./getStackClient";
import {
  CHAT_POINT_SYSTEM_ID,
  MESSAGE_SENT_EVENT,
  MESSAGE_SENT_POINT,
} from "../consts";
import { Message } from "ai";

const trackNewMessage = async (address: Address, message: Message) => {
  const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);
  const uniqueId = `${address}-${Date.now()}`;
  const pointSystemId = MESSAGE_SENT_EVENT;
  await stackClient.track(pointSystemId, {
    points: MESSAGE_SENT_POINT,
    account: address,
    uniqueId,
    metadata: message,
  });
};

export default trackNewMessage;
