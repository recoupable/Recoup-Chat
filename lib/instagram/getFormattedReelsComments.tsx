// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const getFormattedReelsComments = (reelsComments: any) => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return reelsComments.map((reel: any) => {
    const reelUrl = reel?.url;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const comments = reel?.latestComments?.map((comment: any) => ({
      text: comment?.text || "",
      timestamp: new Date(comment?.timestamp || 0).getTime(),
      username: comment?.ownerUsername || "",
    }));

    return {
      reelUrl: reelUrl || "",
      comments: comments || [],
    };
  });
};

export default getFormattedReelsComments;
