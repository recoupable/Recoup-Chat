import { type Post } from "@/hooks/useArtistPosts";
import PostCard from "./PostCard";

interface PostsProps {
  posts: Post[];
}

const Posts = ({ posts }: PostsProps) => {
  // Sort posts by updated_at (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
