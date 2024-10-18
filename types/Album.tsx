export type Album = {
  name: string;
  uri: string;
  image: string;
  popularity: number;
  artist: string;
  geners: Array<string> | undefined;
};
