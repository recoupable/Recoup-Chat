import { AGENT_API } from "../consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getArtistProfile = async (handle: string) => {
  const response = await fetch(
    `${AGENT_API}/api/get_spotify_profile?handle=${handle}`,
  );
  if (!response.ok) {
    const error = await response.text();
    return { error };
  }

  const data = await response.json();
  const profile = data.profile;

  return {
    profile: {
      avatar: profile.image,
      bio: "",
      fans: profile.fans,
      following: 0,
      name: profile.name,
      nickname: profile.name,
      region: "",
    },
    artistId: profile.id,
  };
};

export default getArtistProfile;
