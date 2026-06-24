export type YouTubeSearchResult = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: {
        url: string;
        width?: number;
        height?: number;
      };
      medium?: {
        url: string;
        width?: number;
        height?: number;
      };
      high?: {
        url: string;
        width?: number;
        height?: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
};

async function fetchYouTubeSearchResults(
  session: any,
  query: string,
  maxResults = 24,
): Promise<YouTubeSearchResult[]> {
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new Error("Missing Google access token. Please sign in again.");
  }

  const params = new URLSearchParams({
    part: "snippet",
    maxResults: String(maxResults),
    order: "relevance",
    q: query,
    type: "video",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Failed to fetch YouTube search results.");
  }

  return data.items as YouTubeSearchResult[];
}

export default fetchYouTubeSearchResults;
