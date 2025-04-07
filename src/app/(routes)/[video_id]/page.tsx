import BackButton from '@/app/_component/Atom/BackButton';
import styles from './video.module.css';

export default function Video({ params }: { params: { video_id: string } }) {
  const { video_id: videoID } = params;
  return (
    <>
    <BackButton/>
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://www.youtube.com/embed/${videoID}?rel=0&showinfo=0&autohide=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      </div>
    </div>
    </>
  );
}
