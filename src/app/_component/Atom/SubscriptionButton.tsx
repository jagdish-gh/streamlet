"use client";

import { useSession } from "next-auth/react";
import { MouseEvent, useEffect, useState } from "react";
import { subscribeToChannel, unsubscribeFromChannel } from "@/app/_util/youtubeSubscriptions";
import styles from "./SubscriptionButton.module.css";

type SubscriptionButtonProps = {
  channelId: string;
  initialSubscribed?: boolean;
  initialSubscriptionId?: string;
  onChange?: (subscribed: boolean, subscriptionId?: string) => void;
};

export default function SubscriptionButton({
  channelId,
  initialSubscribed = false,
  initialSubscriptionId,
  onChange,
}: SubscriptionButtonProps) {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [subscriptionId, setSubscriptionId] = useState(initialSubscriptionId);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsSubscribed(initialSubscribed);
    setSubscriptionId(initialSubscriptionId);
  }, [initialSubscribed, initialSubscriptionId]);

  const onToggleSubscription = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!session || isBusy) {
      return;
    }

    setIsBusy(true);
    setError("");

    try {
      if (isSubscribed) {
        if (!subscriptionId) {
          throw new Error("Missing subscription ID. Refresh and try again.");
        }

        await unsubscribeFromChannel(session, subscriptionId);
        setIsSubscribed(false);
        setSubscriptionId(undefined);
        onChange?.(false);
      } else {
        const subscription = await subscribeToChannel(session, channelId);
        setIsSubscribed(true);
        setSubscriptionId(subscription.id);
        onChange?.(true, subscription.id);
      }
    } catch (subscriptionError) {
      setError(subscriptionError instanceof Error ? subscriptionError.message : "Subscription update failed.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={styles.subscriptionControl}>
      <button
        className={isSubscribed ? styles.unsubscribeButton : styles.subscribeButton}
        disabled={isBusy}
        onClick={onToggleSubscription}
        type="button"
      >
        {isBusy ? "Working..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
