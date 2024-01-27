'use client';
import styles from './Channel.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Channel({subscription  }: any) {
    const router = useRouter();
    const onChannelClcik = () => {
        router.push(`/channel/${subscription.snippet.resourceId.channelId}`)
    }
    return <div className={styles.channel} onClick={onChannelClcik}>
        <Image src={subscription.snippet.thumbnails.high.url} width={100} height={100} alt="youtube logo" className={styles.channelLogo}/>
        <p className={styles.channelTitle}>{subscription.snippet.title}</p>   
    </div>;
}