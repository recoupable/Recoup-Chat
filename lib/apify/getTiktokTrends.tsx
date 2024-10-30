import client from "./client";

const getTiktokTrends = async (username: string) => {
  try {
    const profiles = [username];
    const input = {
      hashtags: ["fyp"],
      resultsPerPage: 100,
      proxyCountryCode: "None",
      profiles,
    };

    const run = await client.actor("clockworks/tiktok-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getTiktokTrends;
