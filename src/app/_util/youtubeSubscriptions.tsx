import { YouTubeSubscription } from "./fetchYouTubeSubscriptions";

type YouTubeApiError = {
  error?: {
    message?: string;
    errors?: Array<{
      reason?: string;
    }>;
  };
};

function getAccessToken(session: any) {
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new Error("Missing Google access token. Please sign in again.");
  }

  return accessToken;
}

function getErrorReason(data: YouTubeApiError) {
  return data.error?.errors?.[0]?.reason;
}

export async function findSubscriptionForChannel(session: any, channelId: string): Promise<YouTubeSubscription | undefined> {
  const accessToken = getAccessToken(session);
  const params = new URLSearchParams({
    part: "id,snippet",
    forChannelId: channelId,
    maxResults: "1",
    mine: "true",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Failed to check subscription status.");
  }

  return data.items?.[0] as YouTubeSubscription | undefined;
}

export async function subscribeToChannel(session: any, channelId: string): Promise<YouTubeSubscription> {
  const accessToken = getAccessToken(session);
  const response = await fetch("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: {
        resourceId: {
          kind: "youtube#channel",
          channelId,
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    if (getErrorReason(data) === "subscriptionDuplicate") {
      const existingSubscription = await findSubscriptionForChannel(session, channelId);
      if (existingSubscription) {
        return existingSubscription;
      }
    }

    throw new Error(data?.error?.message ?? "Failed to subscribe to channel.");
  }

  return data as YouTubeSubscription;
}

export async function unsubscribeFromChannel(session: any, subscriptionId: string): Promise<void> {
  const accessToken = getAccessToken(session);
  const params = new URLSearchParams({
    id: subscriptionId,
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?${params.toString()}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => undefined);
    throw new Error(data?.error?.message ?? "Failed to unsubscribe from channel.");
  }
}
