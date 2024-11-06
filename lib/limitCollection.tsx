// eslint-disable-next-line @typescript-eslint/no-explicit-any
const limitCollection = (collection: any, limit?: number) => {
  const limitOffset = limit || 30;

  return collection.slice(0, limitOffset);
};

export default limitCollection;
