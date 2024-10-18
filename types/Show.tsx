import type { Image } from "./Image";

export type Show = {
  available_markets: Array<string>;
  copyrights: Array<any>;
  description: string;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  html_description: string;
  id: string;
  images: Array<Image>;
  is_externally_hosted: boolean;
  languages: Array<string>;
  media_type: string;
  name: string;
  publisher: string;
  total_episodes: number;
  type: string;
  uri: string;
};

export type SAVED_SHOW = {
  show: Show;
  added_at: string;
};
