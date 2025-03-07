# Scratchpad:

# Task 36: Create /posts Page

## Requirements

- Call the API route as documented in `/docs/posts`
- Use the parameter `artist_account_id` from the active artist (activeArtist)
- Display the API response as a series of tiles, with each tile embedding the corresponding social post

## Current Status

The posts API endpoint is already implemented at `https://api.recoupable.com/api/posts` as documented. We need to:

1. Create the posts page at `/app/posts`
2. Implement components to display posts as tiles
3. Fetch data directly from the external API

## Implementation Plan

### Step 1: Create Posts Page

- Create `/app/posts/page.tsx`
- Use client-side component
- Get activeArtist from ArtistProvider
- Fetch posts directly from the external API using React Query

### Step 2: Create Posts Components

- Create a PostsWrapper component (similar to SegmentsWrapper)
- Create a Posts component to display the grid of posts
- Create a PostCard component for individual post tiles
- Implement loading and error states

### Step 3: Style the Posts UI

- Create a responsive grid layout for posts
- Style individual post cards to embed social media content
- Ensure the UI is visually appealing and consistent with the app's design

## Type Definitions

```typescript
// Based on the API documentation
interface Post {
  id: string;
  post_url: string;
  updated_at: string;
}

interface PostsResponse {
  status: string;
  posts: Post[];
}
```

## Implementation Details

1. Created a custom hook `useArtistPosts` to fetch posts from the external API
2. Created a `PostsWrapper` component to handle data fetching and error/loading states
3. Created a `Posts` component to display the grid of posts
4. Created a `PostCard` component that:
   - Detects the social media platform from the post URL
   - Renders an appropriate embed based on the platform
   - Provides a fallback link if embedding fails
5. Created a `PostsSkeleton` component for the loading state

## Progress

- [x] Create Posts page
- [x] Create Posts components
- [x] Style the UI

## Next Steps

- Test the implementation with real data
- Add support for more social media platforms if needed
- Consider adding pagination if there are many posts
