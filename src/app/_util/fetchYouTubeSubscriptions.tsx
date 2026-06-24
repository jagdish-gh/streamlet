
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
// type YouTubeSubscriptions = YouTubeSubscription[];
// export interface YouTubeSubscription {
//   // Define the structure based on your needs and the YouTube API response
// }

async function fetchYouTubeSubscriptions(session: any): Promise<YouTubeSubscription[]> {
  const accessToken = session.accessToken;
  if (!accessToken) {
    throw new Error("Missing Google access token. Please sign in again.");
  }

  const response = await fetch("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Failed to fetch YouTube subscriptions.");
  }

  return data.items as YouTubeSubscription[];
}

export default fetchYouTubeSubscriptions;
