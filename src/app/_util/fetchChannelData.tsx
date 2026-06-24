



  export type channelData = {
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
  };
  export type ChannelDataPage = {
    items: channelData[];
    nextPageToken?: string;
    totalResults?: number;
  };
  // type YouTubeSubscriptions = YouTubeSubscription[];
  // export interface YouTubeSubscription {
  //   // Define the structure based on your needs and the YouTube API response
  // }
  
  async function fetchChannelData(session: any,channelId: string, maxResults: number, pageToken?: string): Promise<ChannelDataPage> {
    const accessToken = session?.accessToken;
    if (!accessToken) {
      throw new Error("Missing Google access token. Please sign in again.");
    }

    const params = new URLSearchParams({
      channelId,
      part: "snippet,id",
      order: "date",
      maxResults: String(maxResults),
      type: "video",
    });

    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to fetch channel videos.");
    }

    return {
      items: data.items as channelData[],
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults,
    };
  }
  
  export default fetchChannelData;
  
