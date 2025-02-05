import supabase from "./supabase/serverClient";

// eslint-disable-next-line
const getPostComments = async (agent_status: any) => {
  // eslint-disable-next-line
  const comments: any = [];
  // eslint-disable-next-line
  const commentsPromise = agent_status.map(async (agent_status: any) => {
    const post_ids = agent_status.social.social_posts.map(
      // eslint-disable-next-line
      (social_post: any) => social_post.post_id,
    );
    const chunkSize = 100;
    const chunkCount =
      parseInt(Number(post_ids.length / chunkSize).toFixed(0), 10) + 1;
    for (let i = 0; i < chunkCount; i++) {
      const chunkPostIds = post_ids.slice(chunkSize * i, chunkSize * (i + 1));
      const { data: posts } = await supabase
        .from("posts")
        .select("*, post_comments(*, social:socials(*))")
        .in("id", chunkPostIds);
      comments.push(posts);
    }
  });

  await Promise.all(commentsPromise);
  return comments.flat();
};

export default getPostComments;
