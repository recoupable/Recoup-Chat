import type { Image } from "./Image";

export type AudioBook = {
  authors: Array<{
    name: string;
  }>;
  available_markets: Array<string>;
  copyrights: Array<any>;
  description: string;
  html_description: string;
  edition: string;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<Image>;
  languages: Array<string>;
  media_type: string;
  name: string;
  narrators: Array<{
    name: string;
  }>;
  publisher: string;
  type: string;
  uri: string;
  total_chapters: number;
};

export type SAVED_AUDIOBOOK = AudioBook & {
  items: Array<AudioBook>;
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
