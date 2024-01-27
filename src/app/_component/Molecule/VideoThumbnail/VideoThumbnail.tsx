import styles from './VideoThumbnail.module.css';
import Image from 'next/image';
export default function VideoThumbnail({ video }: any) {

    return (
        <div className={styles.videoThumbnailBox}>
            <div className={styles.videoThumbnail}>
                <Image src={video.snippet.thumbnails.high.url} alt="youtube thumbnail"  className={styles.image} height={180} width={240}/>
            </div>
            <p className="videoTitle">{video.snippet.title}</p>
        </div>
    );
}