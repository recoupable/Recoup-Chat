// import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { FAN_TYPE } from "@/types/fans";
// import { Artist } from "@/types/Artist";
// import { Album } from "@/types/Album";
// import { Track } from "@/types/Track";
// import getFollows from "./getFollows";
// import { SpecificFocus } from "@/types/Campaign";
// import limitCollections from "../limitCollections";
// import getSortedNames from "../getSortedNames";
// import getCampaignInfo from "../getCampaignInfo";
// import { Playlist } from "@/types/Playlist";

const getCampaign = async (
  client: SupabaseClient<Database, "public">,
  specific_focus: string,
) => {
  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  const playlist = fans.map((fan) => Array.isArray(fan.playlist) || []).flat();
  const artists = fans
    .map((fan) => [
      ...(Array.isArray(fan.followedArtists) ? fan.followedArtists : []),
      ...(Array.isArray(fan.topArtists) ? fan.topArtists : []),
    ])
    .flat();
  const episodes = fans.map((fan) => fan.episodes || []).flat();
  const albums = fans.map((fan) => fan.savedAlbums || []).flat();
  const audioBooks = fans.map((fan) => fan.savedAudioBooks || []).flat();
  const shows = fans.map((fan) => fan.savedShows || []).flat();
  const tracks = fans
    .map((fan) => [
      ...(Array.isArray(fan.topTracks) ? fan.topTracks : []),
      ...(Array.isArray(fan.savedTracks) ? fan.savedTracks : []),
    ])
    .flat();

  const premiumCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "premium",
  ).length;

  const freeCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "free",
  ).length;

  // const rows = fans.map((fan) => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const data = getFandata(fan as unknown as FAN_TYPE, specific_focus) as any;

  //   const focusAreas = [
  //     { key: "playlist", target: playlists },
  //     { key: "episode", target: episodes },
  //     { key: "artists", target: artists },
  //     { key: "albums", target: albums },
  //     { key: "audioBooks", target: audioBooks },
  //     { key: "shows", target: shows },
  //     { key: "tracks", target: tracks },
  //   ];

  //   focusAreas.forEach(({ key, target }) => {
  //     if (
  //       specific_focus === key ||
  //       specific_focus === SpecificFocus.listening_habits
  //     ) {
  //       target.push(...data[key]);
  //     }
  //   });

  //   return {
  //     name: fan.display_name || "Unknown",
  //     country: fan.country || "Unknown",
  //     city: fan.city || "Unknown",
  //   };
  // });

  // playlists = limitCollections(playlists);
  // episodes = limitCollections(episodes);
  // audioBooks = limitCollections(audioBooks);

  // const artistNames = getSortedNames(artists, "name");
  // const albumNames = getSortedNames(albums, "name");
  // const trackNames = getSortedNames(tracks, "name");

  // const followers = await getFollows(client);
  // const campaignInfo = getCampaignInfo(
  //   specific_focus,
  //   playlists,
  //   episodes,
  //   artistNames,
  //   albumNames,
  //   audioBooks,
  //   shows,
  //   trackNames,
  //   rows,
  //   premiumCount,
  //   freeCount,
  //   followers,
  // );

  return {
    playlist,
    artists,
    episodes,
    albums,
    tracks,
    shows,
    audioBooks,
    specific_focus,
    premiumCount,
    freeCount,
  };
};

export default getCampaign;
