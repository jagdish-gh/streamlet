export type YouTubeVideoDetails = {
  id: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    title: string;
  };
};

async function fetchVideoDetails(session: any, videoId: string): Promise<YouTubeVideoDetails> {
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new Error("Missing Google access token. Please sign in again.");
  }

  const params = new URLSearchParams({
    id: videoId,
    part: "snippet",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Failed to fetch video details.");
  }

  const video = data.items?.[0] as YouTubeVideoDetails | undefined;
  if (!video) {
    throw new Error("Video details were not found.");
  }

  return video;
}

export default fetchVideoDetails;
