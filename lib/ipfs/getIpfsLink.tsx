const getIpfsLink = (hash: string): string => {
  if (!hash) return "";
  return hash?.indexOf?.("ipfs://") > -1
    ? hash.replace("ipfs://", `https://ipfs.decentralized-content.com/ipfs/`)
    : hash;
};

export default getIpfsLink;
