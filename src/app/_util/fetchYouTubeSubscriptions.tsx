
interface YouTubeSubscription {
  // Define the structure based on your needs and the YouTube API response
}

async function fetchYouTubeSubscriptions(session): Promise<YouTubeSubscription[]> {
  
  const accessToken = session.accessToken;

  const response = await fetch("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.items as YouTubeSubscription[];
}

export default fetchYouTubeSubscriptions;
