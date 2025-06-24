/**
 * Interface for Instagram comments scraping result
 */
export interface InstagramCommentsResult {
  runId: string;
  datasetId: string;
  error: string | null;
}

/**
 * Runs the Instagram comments scraper for the provided post URLs
 * @param postUrls - Array of Instagram post URLs to fetch comments for
 * @returns Promise with runId, datasetId, and error information
 */
export default async function runInstagramCommentsScraper(
  postUrls: string[]
): Promise<InstagramCommentsResult> {
  try {
    if (!postUrls || postUrls.length === 0) {
      return {
        runId: "",
        datasetId: "",
        error: "At least one Instagram post URL is required",
      };
    }

    // Construct URL with postUrls as query parameters
    const url = new URL("https://api.recoupable.com/api/instagram/comments");
    postUrls.forEach((postUrl) => {
      url.searchParams.append("postUrls", postUrl);
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in runInstagramCommentsScraper:", error);
    return {
      runId: "",
      datasetId: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to scrape Instagram comments",
    };
  }
}