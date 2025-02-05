const getIpfsLink = (uri: string) => {
  if (!uri) return "";
  // Remove ipfs:// prefix if present
  const cid = uri.replace("ipfs://", "");
  // Use Pinata's dedicated gateway
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

export default getIpfsLink;
