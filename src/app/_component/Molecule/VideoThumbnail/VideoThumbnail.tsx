import { useCallback } from 'react';
import styles from './VideoThumbnail.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function VideoThumbnail({ video }: any) {
    const router = useRouter()
    const uploadedDate = new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(video.snippet.publishedAt));

    const getTitle = () => {
        if (video.snippet.title.length > 30) {
            return video.snippet.title.substring(0, 40) + "...";
        }
        return video.snippet.title;
    }
    const onVideoClick = useCallback(()=>{
        router.push(`/${video.id.videoId}`)
    },[router, video.id.videoId])
    
    return (
        <button className={styles.videoThumbnailBox} onClick={onVideoClick} type="button">
            <div className={styles.videoThumbnail} >
                <Image src={video.snippet.thumbnails.high.url} alt="youtube thumbnail"  className={styles.image} height={180} width={240}/>
            </div>
            <div className={styles.videoMeta}>
                <p className={styles.videoTitle} title={video.snippet.title}>{getTitle()}</p>
                <p className={styles.channelName}>{video.snippet.channelTitle}</p>
                <p className={styles.uploadDate}>{uploadedDate}</p>
            </div>
        </button>
    );
}
