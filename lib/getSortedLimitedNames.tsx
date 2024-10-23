export type Item = {
  name: string;
  popularity: number;
};

const getSortedLimitedNames = (items: Item[], count = 50) => {
  return items
    .sort((a, b) => b.popularity - a.popularity)
    .map((item) => item.name || "")
    .slice(0, count);
};

export default getSortedLimitedNames;
