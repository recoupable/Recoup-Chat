// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTikTokContext = (trends: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return trends?.map((trend: any) => ({
    username: trend?.authorMeta?.name || "",
    nickname: trend?.authorMeta?.nickName || "",
    fans: trend?.authorMeta?.fans || 0,
    heart: trend?.authorMeta?.heart || 0,
    description: trend?.text || "",
    region: trend?.authorMeta?.region || "",
    musicName: trend?.musicMeta?.musicName || "",
    musicAuthor: trend?.musicMeta?.musicAuthor || "",
    diggCount: trend?.diggCount || 0,
    shareCount: trend?.shareCount || 0,
    playCount: trend?.playCount || 0,
    collectCount: trend?.collectCount || 0,
    commentCount: trend?.commentCount || 0,
    pfp: trend?.authorMeta?.avatar || "",
    profileUrl: trend?.authorMeta?.profileUrl || "",
  }));
};

export default getTikTokContext;
