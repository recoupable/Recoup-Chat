import { StackClient } from "@stackso/js-core";
import { CHAT_POINT_SYSTEM_ID } from "../consts";

const getStackClient = (pointSystemId: number = CHAT_POINT_SYSTEM_ID) => {
  const stack = new StackClient({
    apiKey: process.env.NEXT_PUBLIC_STACK_KEY as string,
    pointSystemId,
  });

  return stack;
};

export default getStackClient;
