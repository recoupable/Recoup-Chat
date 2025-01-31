import { FAN_TYPE } from "./fans";

export type Artist = {
  name: string;
  uri: string;
  image: string;
  popularity: number;
};

export type SOCIAL = {
  id: string;
  bio: string | null;
  avatar: string | null;
  region: string | null;
  username: string | null;
  updated_at: string;
  profile_url: string;
  followerCount: number;
  followingCount: number;
};

export type ACCOUNT_SOCIAL = {
  id: string;
  social: SOCIAL;
  social_id: string;
  account_id: string;
};

export type ACCOUNT_INFO = {
  account_id: string;
  id: string;
  image: string | null;
  instruction: string | null;
  knowledges: Array<string>;
  label: string | null;
  organization: string;
  updated_at: string;
};

export type ARTIST_INFO = {
  account_id: string;
  artist_id: string;
  id: string;
  updated_at: string;
  artist: {
    id: string;
    name: string;
    timestamp: number | null;
    account_socials: Array<ACCOUNT_SOCIAL>;
    account_info: Array<ACCOUNT_INFO>;
  };
  isWrapped?: boolean;
};

export type CampaignRecord = {
  id: string;
  timestamp: number;
  artistId: string;
  clientId: string;
  fans: FAN_TYPE[];
};
