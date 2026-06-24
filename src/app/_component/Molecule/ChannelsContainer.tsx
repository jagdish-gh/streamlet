'use client';
import fetchYouTubeSubscriptions from "@/app/_util/fetchYouTubeSubscriptions";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import styles from './ChannelsContainer.module.css';
import Channel from "./Channel/Channel";
import { YouTubeSubscription } from "@/app/_util/fetchYouTubeSubscriptions";

const MyPage: React.FC = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<YouTubeSubscription[]>([]);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string>();
  const [totalResults, setTotalResults] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadSubscriptions = useCallback(async (pageToken?: string, replace = false) => {
    if (!session || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const page = await fetchYouTubeSubscriptions(session, pageToken);
      setSubscriptions(currentSubscriptions => {
        if (replace) {
          return page.items;
        }

        const seenIds = new Set(currentSubscriptions.map(subscription => subscription.id));
        const newSubscriptions = page.items.filter(subscription => !seenIds.has(subscription.id));
        return [...currentSubscriptions, ...newSubscriptions];
      });
      setNextPageToken(page.nextPageToken);
      setTotalResults(page.totalResults);
      setError("");
    } catch (subscriptionError) {
      setError(subscriptionError instanceof Error ? subscriptionError.message : "Could not load subscriptions.");
      if (replace) {
        setSubscriptions([]);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      setSubscriptions([]);
      setNextPageToken(undefined);
      setTotalResults(undefined);
      loadSubscriptions(undefined, true);
    }
  }, [loadSubscriptions, session]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextPageToken) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          loadSubscriptions(nextPageToken);
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadSubscriptions, nextPageToken]);

  return <section className={styles.homeSection}>
    <div className={styles.sectionHeader}>
      <p className={styles.eyebrow}>Subscriptions</p>
      <h1 className={styles.title}>Your channels</h1>
      <p className={styles.summary}>
        {subscriptions.length}
        {totalResults ? ` of ${totalResults}` : ""} saved channels
      </p>
    </div>
    {error && <p className={styles.message}>{error}</p>}
    <div className={styles.channelsContainer}>
      {subscriptions?.map(subscription => (
        <Channel key={subscription.id} subscription={subscription} />
      ))}
    </div>
    <div className={styles.loadSentinel} ref={sentinelRef}>
      {isLoading && <span>Loading more channels...</span>}
      {!isLoading && !nextPageToken && subscriptions.length > 0 && <span>All channels loaded</span>}
    </div>
  </section>;
};

export default MyPage;
