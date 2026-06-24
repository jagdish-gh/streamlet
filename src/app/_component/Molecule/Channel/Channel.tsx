'use client';
import styles from './Channel.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SubscriptionButton from '../../Atom/SubscriptionButton';

export default function Channel({subscription, onUnsubscribe  }: any) {
    const router = useRouter();
    const channelId = subscription.snippet.resourceId.channelId;
    const onChannelClcik = () => {
        router.push(`/channel/${channelId}`)
    }
    return <div className={styles.channel}>
        <button className={styles.channelContent} onClick={onChannelClcik} type="button">
            <Image src={subscription.snippet.thumbnails.high.url} width={100} height={100} alt="youtube logo" className={styles.channelLogo}/>
            <p className={styles.channelTitle}>{subscription.snippet.title}</p>
        </button>
        <SubscriptionButton
            channelId={channelId}
            initialSubscribed
            initialSubscriptionId={subscription.id}
            onChange={(subscribed) => {
                if (!subscribed) {
                    onUnsubscribe?.(subscription.id);
                }
            }}
        />
    </div>;
}
