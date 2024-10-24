// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSortedNames = (items: any[], key: string) => {
  return (
    items
      .sort((a, b) => b.popularity - a.popularity)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item[key] || "")
      .slice(0, 50)
  );
};

export default getSortedNames;
