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
  useEffect(() => {
    if (session) {
      fetchYouTubeSubscriptions(session).then(subscriptions => {
        setSubscriptions(subscriptions);
      });
    }
  }, [session]);

  // Render your page content here
  return <div className={styles.channelsContainer}>
      {subscriptions?.map(subscription => (
        <Channel key={subscription.id} subscription={subscription} />
      ))}
  </div>;
};

export default MyPage;
