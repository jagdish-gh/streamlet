import { useCallback } from 'react';
import styles from './VideoThumbnail.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function VideoThumbnail({ video }: any) {
    const router = useRouter()
    const getTitle = () => {
        if (video.snippet.title.length > 30) {
            return video.snippet.title.substring(0, 40) + "...";
        }
        return video.snippet.title;
    }
    const onVideoClick = useCallback(()=>{
        router.push(`/${video.id.videoId}`)
    },[])
    
    return (
        <div className={styles.videoThumbnailBox} onClick={onVideoClick}>
            <div className={styles.videoThumbnail} >
                <Image src={video.snippet.thumbnails.high.url} alt="youtube thumbnail"  className={styles.image} height={180} width={240}/>
            </div>
            <p className="videoTitle" title={video.snippet.title}>{getTitle()}</p>
        </div>
    );
}