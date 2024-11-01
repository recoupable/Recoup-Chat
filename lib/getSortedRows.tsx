// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSortedRows = (rows: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortedRows = rows?.sort((a: any, b: any) => {
    const timestampA = a.timestamp
      ? new Date(a.timestamp).getTime()
      : Number.NEGATIVE_INFINITY;
    const timestampB = b.timestamp
      ? new Date(b.timestamp).getTime()
      : Number.NEGATIVE_INFINITY;
    return timestampA - timestampB;
  });

  return sortedRows;
};

export default getSortedRows;
