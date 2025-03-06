export const codeExamples = {
  curl: `curl -X GET "https://api.recoupable.com/api/posts" \\
  -H "Content-Type: application/json" \\
  -d '{"artist_account_id": "YOUR_ARTIST_ACCOUNT_ID"}'`,
  python: `import requests

headers = {
    "Content-Type": "application/json"
}

params = {
    "artist_account_id": "YOUR_ARTIST_ACCOUNT_ID"
}

response = requests.get("https://api.recoupable.com/api/posts", headers=headers, params=params)
data = response.json()`,
  javascript: `fetch("https://api.recoupable.com/api/posts?artist_account_id=YOUR_ARTIST_ACCOUNT_ID", {
  headers: {
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
  typescript: `interface Post {
  id: string;
  post_url: string;
  updated_at: string;
}

interface PostsResponse {
  status: string;
  posts: Post[];
}

const fetchArtistPosts = async (artistAccountId: string) => {
  const response = await fetch(\`https://api.recoupable.com/api/posts?artist_account_id=\${artistAccountId}\`, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data: PostsResponse = await response.json();
  return data;
};`,
} as const;

export const exampleResponse = {
  status: "success",
  posts: [
    {
      id: "post123",
      post_url: "https://twitter.com/artist/status/123456789",
      updated_at: "2024-03-06T15:33:27Z",
    },
    {
      id: "post456",
      post_url: "https://instagram.com/p/abc123",
      updated_at: "2024-03-05T18:22:15Z",
    },
  ],
} as const;

export const responseProperties = [
  {
    name: "status",
    type: "string",
    description: 'Status of the request ("success" or "error")',
  },
  {
    name: "posts",
    type: "array",
    description: "List of posts from the artist across all social platforms",
  },
  {
    name: "posts[].id",
    type: "string",
    description: "Unique identifier for the post",
  },
  {
    name: "posts[].post_url",
    type: "string",
    description: "Direct URL to the post on the social platform",
  },
  {
    name: "posts[].updated_at",
    type: "string",
    description: "ISO timestamp of when the post was last updated",
  },
] as const;
