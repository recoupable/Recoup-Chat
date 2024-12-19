import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { AGENT_API } from "../consts";
import getFormattedReelsComments from "./getFormattedReelsComments";

const getReelsComments = async (
  handle: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStatus?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProgress?: any,
) => {
  const response = await fetch(
    `${AGENT_API}/api/get_instagram_reels?handle=${handle}`,
  );
  if (!response.ok) throw Error("failed!");
  const data = await response.json();
  const datasetId = data.data;
  let attempts = 0;
  const maxAttempts = 30;
  let progress = 0;
  while (1) {
    attempts++;
    progress = (attempts / maxAttempts) * 100;
    if (progress < 20) getStatus(STEP_OF_ANALYSIS.POSTURLS);
    if (progress > 20) getStatus(STEP_OF_ANALYSIS.VIDEO_COMMENTS);
    if (updateProgress && progress < 100) updateProgress(progress);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const datasetItemsRes = await fetch(
      `${AGENT_API}/api/get_dataset_items?datasetId=${datasetId}`,
    );
    if (!datasetItemsRes.ok) throw Error("failed!");
    const datasetItems = await datasetItemsRes.json();
    const commentsInfo = datasetItems.data;
    const statusRes = await fetch(
      `${AGENT_API}/api/get_dataset_status?datasetId=${datasetId}`,
    );
    const statusInfo = await statusRes.json();
    const status = statusInfo.data;
    if (status === "SUCCEEDED" || progress > 95) {
      updateProgress(100);
      return getFormattedReelsComments(commentsInfo);
    }
  }
};

export default getReelsComments;
