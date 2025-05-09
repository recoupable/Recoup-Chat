export const getDisplayToolName = (name: string) => {
    switch (name) {
        case "generate_image":
            return "Generate Image";
        case "generate_mermaid_diagram":
            return "Generate Mermaid Diagram";
        case "create_new_artist":
            return "Create New Artist";
        case "delete_artist":
            return "Delete Artist";
        case "get_spotify_search":
            return "Get Spotify Search";
        case "contact_team":
            return "Contact Team";
        case "get_artist_segments":
            return "Get Artist Segments";
        case "get_segment_fans":
            return "Get Segment Fans";
        case "get_artist_socials":
            return "Get Artist Socials";
        case "get_social_posts":
            return "Get Social Posts";
        case "get_post_comments":
            return "Get Post Comments";
        case "perplexity_ask":
            return "Perplexity Ask";
        default:
            return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
};