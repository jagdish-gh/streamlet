"use client";

import SubscriptionButton from "@/app/_component/Atom/SubscriptionButton";
import fetchVideoDetails, { YouTubeVideoDetails } from "@/app/_util/fetchVideoDetails";
import { findSubscriptionForChannel } from "@/app/_util/youtubeSubscriptions";
import { YouTubeSubscription } from "@/app/_util/fetchYouTubeSubscriptions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./video.module.css";

type WatchSubscriptionPanelProps = {
  videoId: string;
};

export default function WatchSubscriptionPanel({ videoId }: WatchSubscriptionPanelProps) {
  const { data: session } = useSession();
  const [video, setVideo] = useState<YouTubeVideoDetails>();
  const [subscription, setSubscription] = useState<YouTubeSubscription>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || !videoId) {
      return;
    }

    let isMounted = true;
    setError("");

    fetchVideoDetails(session, videoId)
      .then(async (videoDetails) => {
        const currentSubscription = await findSubscriptionForChannel(session, videoDetails.snippet.channelId);
        if (isMounted) {
          setVideo(videoDetails);
          setSubscription(currentSubscription);
        }
      })
      .catch((detailsError) => {
        if (isMounted) {
          setError(detailsError instanceof Error ? detailsError.message : "Could not load video details.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [session, videoId]);

  if (error) {
    return <p className={styles.watchMessage}>{error}</p>;
  }

  if (!video) {
    return <p className={styles.watchMessage}>Loading video details...</p>;
  }

  return (
    <section className={styles.watchPanel}>
      <div className={styles.watchMeta}>
        <h1 className={styles.videoTitle}>{video.snippet.title}</h1>
        <p className={styles.channelTitle}>{video.snippet.channelTitle}</p>
      </div>
      <div className={styles.subscribeArea}>
        <SubscriptionButton
          channelId={video.snippet.channelId}
          initialSubscribed={Boolean(subscription)}
          initialSubscriptionId={subscription?.id}
          onChange={(subscribed, subscriptionId) => {
            if (subscribed) {
              setSubscription((currentSubscription) => ({
                ...currentSubscription,
                id: subscriptionId ?? currentSubscription?.id ?? "",
              } as YouTubeSubscription));
            } else {
              setSubscription(undefined);
            }
          }}
        />
      </div>
    </section>
  );
}
