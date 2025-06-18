import { Database } from "./database.types";

type SocialBase = Omit<Database["public"]["Tables"]["socials"]["Row"], "followerCount" | "followingCount">;

export type Social = SocialBase & {
  social_id: string;
  follower_count: number;
  following_count: number; 
};

export interface ArtistSocialsResultType {
  success: boolean;
  nextSteps: string[];
  artistSocials?: {
    status: string;
    socials: Array<Social>;
    success: boolean;
    pagination: {
      page: number;
      limit: number;
      total_count: number;
      total_pages: number;
    };
  };
  artist_account_id: string;
}