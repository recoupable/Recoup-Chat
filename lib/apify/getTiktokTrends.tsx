import client from "./client";
import demo from "./trends.json";

const getTiktokTrends = async () => {
  try {
    const { defaultDatasetId } = await client
      .actor("novi/fast-tiktok-api")
      .call();

    const datasetClient = client.dataset(defaultDatasetId);

    const limit = 1000;
    let offset = 0;
    const allItems = [];
    while (true) {
      const { items, total } = await datasetClient.listItems({ limit, offset });
      allItems.push(...items);
      if (offset + limit >= total) {
        break;
      }
      offset += limit;
    }

    return allItems;
  } catch (error) {
    console.error(error);
    return demo;
  }
};

export default getTiktokTrends;
