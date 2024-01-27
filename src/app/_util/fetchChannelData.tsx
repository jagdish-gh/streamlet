



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
  // type YouTubeSubscriptions = YouTubeSubscription[];
  // export interface YouTubeSubscription {
  //   // Define the structure based on your needs and the YouTube API response
  // }
  
  async function fetchChannelData(session: any,channelId: string, maxResults: number): Promise<channelData[]> {
    
    const accessToken = session?.accessToken;
    console.log(accessToken)
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const data = await response.json();
    return data.items as channelData[];
  }
  
  export default fetchChannelData;
  