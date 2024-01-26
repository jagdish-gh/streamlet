'use client';
import styles from './Channel.module.css';
export default function Channel({subscription  }: any) {
    // const {subscription} = props;
    // console.log({subscription})
    return <div className={styles.channel}>
        <img src={subscription.snippet.thumbnails.high.url} alt="channel logo" className={styles.channelLogo}/>
        <p>{subscription.snippet.title}</p>
        
    </div>;
}