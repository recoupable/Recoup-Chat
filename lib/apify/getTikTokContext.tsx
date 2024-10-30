// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTikTokContext = (trends: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return trends.map((trend: any) => ({
    username: trend?.authorMeta?.name,
    nickname: trend?.authorMeta?.nickName,
    fans: trend?.authorMeta?.fans,
    heart: trend?.authorMeta?.heart,
    description: trend?.text,
    region: trend?.authorMeta?.region,
    musicName: trend?.musicMeta?.musicName,
    musicAuthor: trend?.musicMeta?.musicAuthor,
    diggCount: trend?.diggCount,
    shareCount: trend?.shareCount,
    playCount: trend?.playCount,
    collectCount: trend?.collectCount,
    commentCount: trend?.commentCount,
    pfp: trend?.authorMeta?.avatar,
    profileUrl: trend?.authorMeta?.profileUrl,
  }));
};

export default getTikTokContext;
