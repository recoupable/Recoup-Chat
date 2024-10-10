import { Address } from "viem";

export type SCORE_EVENT = {
  address: Address;
  event: string;
  metadata: {
    time: number;
    userId: string;
    username: string;
  };
  points: 1091;
  timestamp: number;
};
