import { FAN_TYPE } from "./fans";

export type Artist = {
  name: string;
  uri: string;
  image: string;
  popularity: number;
};

export type ArtistRecord = {
  name: string;
  id: string;
  timestamp: number;
};

export type CampaignRecord = {
  id: string;
  timestamp: number;
  artistId: string;
  clientId: string;
  fans: FAN_TYPE[];
};
