'use client';
import fetchYouTubeSubscriptions from "@/app/_util/fetchYouTubeSubscriptions";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import styles from './ChannelsContainer.module.css';
import Channel from "./Channel/Channel";
import { YouTubeSubscription } from "@/app/_util/fetchYouTubeSubscriptions";

const MyPage: React.FC = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<YouTubeSubscription[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (session) {
      fetchYouTubeSubscriptions(session)
        .then(subscriptions => {
          setSubscriptions(subscriptions);
          setError("");
        })
        .catch(subscriptionError => {
          setError(subscriptionError instanceof Error ? subscriptionError.message : "Could not load subscriptions.");
          setSubscriptions([]);
        });
    }
  }, [session]);

  return <section className={styles.homeSection}>
    <div className={styles.sectionHeader}>
      <p className={styles.eyebrow}>Subscriptions</p>
      <h1 className={styles.title}>Your channels</h1>
      <p className={styles.summary}>{subscriptions.length} saved channels</p>
    </div>
    {error && <p className={styles.message}>{error}</p>}
    <div className={styles.channelsContainer}>
      {subscriptions?.map(subscription => (
        <Channel key={subscription.id} subscription={subscription} />
      ))}
    </div>
  </section>;
};

export default MyPage;
