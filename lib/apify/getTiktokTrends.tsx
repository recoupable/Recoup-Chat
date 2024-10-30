import client from "./client";

const getTiktokTrends = async () => {
  const { defaultDatasetId } = await client
    .actor("novi/tiktok-trend-api")
    .call();
  const datasetClient = client.dataset(defaultDatasetId);
  const limit = 1000;
  let offset = 0;
  const allItems = [];
  while (true) {
    const { items, total } = await datasetClient.listItems({ limit, offset });
    console.log(`Fetched ${items.length} items`);
    allItems.push(...items);
    if (offset + limit >= total) {
      break;
    }
    offset += limit;
  }

  return allItems;
};

export default getTiktokTrends;
