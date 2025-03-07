import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistPosts } from "@/hooks/useArtistPosts";
import Posts from "./Posts";
import PostsSkeleton from "./PostsSkeleton";

const PostsWrapper = () => {
  const { selectedArtist } = useArtistProvider();
  const {
    data: posts,
    isLoading,
    error,
  } = useArtistPosts(selectedArtist?.account_id);

  if (!selectedArtist || isLoading) {
    return <PostsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-lg text-center text-red-500 py-8">
        Failed to load posts
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-lg text-center py-8">
        No posts found for this artist.
      </div>
    );
  }

  return <Posts posts={posts} />;
};

export default PostsWrapper;
