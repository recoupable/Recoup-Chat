import { SCORE_EVENT } from "@/types/score";
import { LUH_TYLER_3D_SCORE, SCORE_POINT_SYSTEM_ID } from "../consts";
import getStackClient from "./getStackClient";

const getUsersScore = async () => {
  const stackClient = getStackClient(SCORE_POINT_SYSTEM_ID);

  const events = await stackClient.getEvents({
    query: stackClient
      .eventsQuery()
      .where({
        eventType: LUH_TYLER_3D_SCORE,
      })
      .offset(0)
      .build(),
  });

  return events.map((event) => ({
    ...event,
    timestamp: new Date(event.timestamp).getTime(),
  })) as SCORE_EVENT[];
};

export default getUsersScore;
