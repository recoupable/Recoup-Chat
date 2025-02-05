import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");

  try {
    const { data: account } = await supabase
      .from("accounts")
      .select("*, account_socials(*)")
      .eq("id", artistId)
      .single();

    if (!account) return Response.json({ comments: [] }, { status: 200 });

    const socialIds = account.account_socials.map(
      // eslint-disable-next-line
      (account_social: any) => account_social.social_id,
    );

    const { data: social_posts } = await supabase
      .from("social_posts")
      .select("*")
      .in("social_id", socialIds);

    if (!social_posts?.length)
      return Response.json({ comments: [] }, { status: 200 });

    const postIds = social_posts.map((social_post) => social_post.post_id);
    const comments = [];
    const chunkSize = 10;
    const chunkCount =
      parseInt(Number(postIds.length / chunkSize).toFixed(0), 10) + 1;
    for (let i = 0; i < chunkCount; i++) {
      const chunkPostIds = postIds.slice(chunkSize * i, chunkSize * (i + 1));
      const { data: posts } = await supabase
        .from("posts")
        .select("*, post_comments(*, social:socials(*), post:posts(*))")
        .in("id", chunkPostIds);
      if (posts) {
        const post_comments = posts.map((post) => post.post_comments);
        comments.push(
          post_comments
            .flat()
            .filter(
              (post_comment) =>
                !socialIds.some(
                  (socialId: string) => socialId === post_comment.social_id,
                ),
            ),
        );
        if (comments.flat().length > 500) break;
      }
    }

    const formattedComments = comments
      .flat()
      .slice(0, 500)
      .map((comment) => ({
        comment: comment.comment,
        commented_at: comment.commented_at,
        post_url: comment.post.post_url,
        commented_fan: {
          username: comment.social.username,
          profile_url: comment.social.profile_url,
        },
        id: comment.id,
      }));
    return Response.json({ comments: formattedComments }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
