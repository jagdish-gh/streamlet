
export type YouTubeSubscription = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
      publishedAt: string;
      title: string;
      description: string;
      resourceId: {
          kind: string;
          channelId: string;
      };
      channelId: string;
      thumbnails: {
          default: {
              url: string;
          };
          medium: {
              url: string;
          };
          high: {
              url: string;
          };
      };
  };
};

export type YouTubeSubscriptionsPage = {
  items: YouTubeSubscription[];
  nextPageToken?: string;
  totalResults?: number;
};
// type YouTubeSubscriptions = YouTubeSubscription[];
// export interface YouTubeSubscription {
//   // Define the structure based on your needs and the YouTube API response
// }

async function fetchYouTubeSubscriptions(session: any, pageToken?: string): Promise<YouTubeSubscriptionsPage> {
  const accessToken = session.accessToken;
  if (!accessToken) {
    throw new Error("Missing Google access token. Please sign in again.");
  }

  const params = new URLSearchParams({
    part: "snippet",
    mine: "true",
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Failed to fetch YouTube subscriptions.");
  }

  return {
    items: data.items as YouTubeSubscription[],
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo?.totalResults,
  };
}

export default fetchYouTubeSubscriptions;
