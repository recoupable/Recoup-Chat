import { AGENT_API } from "./consts";

const getHandles = async (handle: string) => {
  try {
    const response = await fetch(
      `${AGENT_API}/api/get_social_handles?handle=${encodeURIComponent(handle)}`,
    );
    if (!response.ok)
      return {
        spotify: "",
        twitter: "",
        instagram: "",
        tiktok: "",
      };
    const data = await response.json();
    const handles = data?.data;
    return {
      spotify: handles?.spotify?.replaceAll("@", "") || "",
      twitter: handles?.twitter?.replaceAll("@", "") || "",
      instagram: handles?.instagram?.replaceAll("@", "") || "",
      tiktok: handles?.tiktok?.replaceAll("@", "") || "",
    };
  } catch (error) {
    console.error(error);
    return {
      spotify: "",
      twitter: "",
      instagram: "",
      tiktok: "",
    };
  }
};

export default getHandles;
