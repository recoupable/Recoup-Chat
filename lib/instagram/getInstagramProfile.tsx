import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { AGENT_API } from "../consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getInstagramProfile = async (handle: string, setThought?: any) => {
  const response = await fetch(
    `${AGENT_API}/api/get_instagram_profile?handle=${handle}`,
  );
  if (!response.ok) {
    const error = await response.text();
    return { error };
  }
  const data = await response.json();
  const datasetId = data.data;

  while (1) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (setThought) setThought(STEP_OF_ANALYSIS.PROFILE);
    const datasetItemsRes = await fetch(
      `${AGENT_API}/api/get_dataset_items?datasetId=${datasetId}`,
    );
    if (!datasetItemsRes.ok) {
      const error = await datasetItemsRes.text();
      return { error };
    }
    const datasetItems = await datasetItemsRes.json();

    const profileInfo = datasetItems.data;
    const statusRes = await fetch(
      `${AGENT_API}/api/get_dataset_status?datasetId=${datasetId}`,
    );
    const statusInfo = await statusRes.json();
    const status = statusInfo.data;
    if (profileInfo && status === "SUCCEEDED")
      return {
        nickname: profileInfo?.[0]?.fullName,
        name: profileInfo?.[0]?.username,
        bio: profileInfo?.[0]?.biography,
        fans: profileInfo?.[0]?.followersCount,
        following: profileInfo?.[0]?.followersCount,
        avatar: profileInfo?.[0]?.profilePicUrl,
      };
  }
};

export default getInstagramProfile;
