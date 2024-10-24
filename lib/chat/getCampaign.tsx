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

  const { playlist, artists, episodes, albums, audioBooks, shows, tracks } =
    fans.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: any, fan) => {
        acc.playlist.push(...(Array.isArray(fan.playlist) ? fan.playlist : []));
        if (Array.isArray(fan.followedArtists)) {
          acc.artists.push(...fan.followedArtists);
        }
        if (Array.isArray(fan.topArtists)) {
          acc.artists.push(...fan.topArtists);
        }
        acc.episodes.push(...(Array.isArray(fan.episodes) ? fan.episodes : []));
        acc.albums.push(
          ...(Array.isArray(fan.savedAlbums) ? fan.savedAlbums : []),
        );
        acc.audioBooks.push(
          ...(Array.isArray(fan.savedAudioBooks) ? fan.savedAudioBooks : []),
        );
        acc.shows.push(
          ...(Array.isArray(fan.savedShows) ? fan.savedShows : []),
        );
        if (Array.isArray(fan.topTracks)) {
          acc.tracks.push(...fan.topTracks);
        }
        if (Array.isArray(fan.savedTracks)) {
          acc.tracks.push(...fan.savedTracks);
        }
        return acc;
      },
      {
        playlist: [],
        artists: [],
        episodes: [],
        albums: [],
        audioBooks: [],
        shows: [],
        tracks: [],
      },
    );

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